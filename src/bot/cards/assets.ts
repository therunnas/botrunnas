import { createCanvas, loadImage, type Image } from "@napi-rs/canvas";
import type { Guild, GuildMember, PartialGuildMember, User } from "discord.js";
import type { CardConfig, GeneratedCard } from "./cardConfig.js";

export type MemberCardInput = {
  user: User;
  member: GuildMember | PartialGuildMember;
  guild: Guild;
  memberCount: number;
  title: string;
  subtitle: string;
  filePrefix: "welcome" | "leave";
  config: CardConfig;
};

type DrawCardInput = MemberCardInput & {
  avatar: Image | null;
};

type CardCanvas = ReturnType<typeof createCanvas>;
type CardCanvasContext = ReturnType<CardCanvas["getContext"]> & {
  drawImage(image: Image, dx: number, dy: number, dw: number, dh: number): void;
};

const fontFamily = "Arial";

export async function createMemberCard(input: MemberCardInput): Promise<GeneratedCard> {
  const avatar = await loadAvatar(input.user);
  const canvas = createCanvas(input.config.width, input.config.height);
  const context = canvas.getContext("2d") as CardCanvasContext;

  drawCard(context, { ...input, avatar });

  return {
    buffer: canvas.toBuffer("image/png"),
    fileName: `${input.filePrefix}-${input.user.id}.png`
  };
}

async function loadAvatar(user: User) {
  try {
    const avatarUrl = user.displayAvatarURL({ extension: "png", size: 256 });
    return await loadImage(avatarUrl);
  } catch {
    return null;
  }
}

function drawCard(context: CardCanvasContext, input: DrawCardInput) {
  const { width, height, textColor, accentColor } = input.config;

  context.clearRect(0, 0, width, height);

  const avatarSize = Math.min(128, Math.max(104, Math.floor(height * 0.36)));
  const avatarX = Math.floor((width - avatarSize) / 2);
  const avatarY = Math.max(24, Math.floor(height * 0.07));
  drawAvatar(context, input, avatarX, avatarY, avatarSize);

  const centerX = Math.floor(width / 2);
  const textMaxWidth = width - 72;
  const avatarBottom = avatarY + avatarSize;
  const titleY = avatarBottom + Math.max(38, Math.floor(height * 0.11));
  const nameY = titleY + Math.max(36, Math.floor(height * 0.1));
  const subtitleY = nameY + Math.max(31, Math.floor(height * 0.09));
  const title = getCardTitle(input);
  const displayName = toCanvasText(getDisplayName(input), { uppercase: true }) || "USUARIO";
  const subtitle = getCardSubtitle(input);

  context.textAlign = "center";
  context.textBaseline = "alphabetic";

  context.fillStyle = textColor;
  setFittedFont(context, title, 44, 30, 800, textMaxWidth);
  context.fillText(title, centerX, titleY, textMaxWidth);

  context.fillStyle = accentColor;
  setFittedFont(context, displayName, 34, 24, 800, textMaxWidth);
  context.fillText(displayName, centerX, nameY, textMaxWidth);

  context.fillStyle = textColor;
  context.font = `700 20px ${fontFamily}`;
  wrapCenteredText(context, subtitle, centerX, subtitleY, textMaxWidth, 24, 2);
}

function drawAvatar(
  context: CardCanvasContext,
  input: DrawCardInput,
  x: number,
  y: number,
  size: number
) {
  context.fillStyle = "#111111";
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  context.fill();

  context.save();
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  context.closePath();
  context.clip();

  if (input.avatar) {
    context.drawImage(input.avatar, x, y, size, size);
  } else {
    context.fillStyle = "#151515";
    context.fillRect(x, y, size, size);
    context.fillStyle = input.config.textColor;
    context.font = `800 ${Math.floor(size * 0.34)}px ${fontFamily}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(getInitials(input), x + size / 2, y + size / 2);
    context.textAlign = "start";
    context.textBaseline = "alphabetic";
  }

  context.restore();

  context.strokeStyle = "#000000";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / 2 - 2, 0, Math.PI * 2);
  context.stroke();
}

function wrapCenteredText(
  context: CardCanvasContext,
  text: string,
  centerX: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const testLine = current ? `${current} ${word}` : word;

    if (context.measureText(testLine).width <= maxWidth) {
      current = testLine;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines) break;
  }

  if (current && lines.length < maxLines) lines.push(current);

  for (const [index, line] of lines.entries()) {
    const suffix = index === maxLines - 1 && words.join(" ").length > lines.join(" ").length ? "..." : "";
    context.fillText(`${line}${suffix}`, centerX, y + index * lineHeight, maxWidth);
  }
}

function setFittedFont(
  context: CardCanvasContext,
  text: string,
  baseSize: number,
  minSize: number,
  weight: number,
  maxWidth: number
) {
  let fontSize = baseSize;

  while (fontSize > minSize) {
    context.font = `${weight} ${fontSize}px ${fontFamily}`;

    if (context.measureText(text).width <= maxWidth) {
      return;
    }

    fontSize -= 2;
  }

  context.font = `${weight} ${minSize}px ${fontFamily}`;
}

function getDisplayName(input: DrawCardInput) {
  return "displayName" in input.member && input.member.displayName
    ? input.member.displayName
    : input.user.username;
}

function getInitials(input: DrawCardInput) {
  const source = getDisplayName(input).trim() || input.user.username;
  return toCanvasText(source, { uppercase: true }).slice(0, 2) || "RU";
}

function toCanvasText(value: string, options: { uppercase?: boolean } = {}) {
  const ascii = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return options.uppercase ? ascii.toUpperCase() : ascii;
}

function getFallbackTitle(input: DrawCardInput) {
  return input.filePrefix === "welcome" ? "BEM VINDO" : "ADEUS";
}

function getFallbackSubtitle(input: DrawCardInput) {
  return input.filePrefix === "welcome" ? "SO RELAXA E APROVEITA!" : "POXA E FOI EMBORA.";
}

function getCardTitle(input: DrawCardInput) {
  const cleaned = toCanvasText(input.title, { uppercase: true }) || getFallbackTitle(input);
  return cleaned.replace(/BEM-?VINDO/g, "BEM VINDO");
}

function getCardSubtitle(input: DrawCardInput) {
  return toCanvasText(input.subtitle) || getFallbackSubtitle(input);
}

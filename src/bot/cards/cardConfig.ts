import { readEnvBoolean, readEnvNumber, readEnvString } from "../../config/env.js";

export type CardConfig = {
  welcomeCardEnabled: boolean;
  leaveCardEnabled: boolean;
  width: number;
  height: number;
  welcomeTitle: string;
  welcomeSubtitle: string;
  leaveTitle: string;
  leaveSubtitle: string;
  textColor: string;
  accentColor: string;
};

export type GeneratedCard = {
  buffer: Buffer;
  fileName: string;
};

function readColor(name: string, fallback: string) {
  const value = readEnvString(name, fallback);

  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`${name} deve usar formato hexadecimal #RRGGBB.`);
  }

  return value;
}

export function loadCardConfig(): CardConfig {
  return {
    welcomeCardEnabled: readEnvBoolean("DISCORD_WELCOME_CARD_ENABLED", false),
    leaveCardEnabled: readEnvBoolean("DISCORD_LEAVE_CARD_ENABLED", false),
    width: readEnvNumber("DISCORD_CARD_WIDTH", 820),
    height: readEnvNumber("DISCORD_CARD_HEIGHT", 360),
    welcomeTitle: readEnvString("DISCORD_WELCOME_CARD_TITLE", "BEM VINDO"),
    welcomeSubtitle: readEnvString(
      "DISCORD_WELCOME_CARD_SUBTITLE",
      "SO RELAXA E APROVEITA!"
    ),
    leaveTitle: readEnvString("DISCORD_LEAVE_CARD_TITLE", "ADEUS"),
    leaveSubtitle: readEnvString("DISCORD_LEAVE_CARD_SUBTITLE", "POXA E FOI EMBORA."),
    textColor: readColor("DISCORD_CARD_TEXT_COLOR", "#FFFFFF"),
    accentColor: readColor("DISCORD_CARD_ACCENT_COLOR", "#EF4444")
  };
}

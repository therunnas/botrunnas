import "dotenv/config";
import type { LogLevel } from "../utils/logger.js";

export type BotEnv = {
  botEnabled: boolean;
  token: string;
  welcomeEnabled: boolean;
  welcomeChannelId: string;
  welcomeMessage: string;
  leaveEnabled: boolean;
  leaveChannelId: string;
  leaveMessage: string;
  logLevel: LogLevel;
};

const booleanValues = new Set(["true", "false"]);
const logLevels = new Set<LogLevel>(["debug", "info", "warn", "error"]);

function readString(name: string, fallback = "") {
  return (process.env[name] ?? fallback).trim();
}

function readBoolean(name: string, fallback: boolean) {
  const raw = readString(name, String(fallback)).toLowerCase();

  if (!booleanValues.has(raw)) {
    throw new Error(`${name} deve ser true ou false.`);
  }

  return raw === "true";
}

function readLogLevel() {
  const raw = readString("LOG_LEVEL", "info").toLowerCase() as LogLevel;

  if (!logLevels.has(raw)) {
    throw new Error("LOG_LEVEL deve ser debug, info, warn ou error.");
  }

  return raw;
}

export function loadEnv(): BotEnv {
  return {
    botEnabled: readBoolean("DISCORD_BOT_ENABLED", true),
    token: readString("DISCORD_BOT_TOKEN"),
    welcomeEnabled: readBoolean("DISCORD_WELCOME_ENABLED", true),
    welcomeChannelId: readString("DISCORD_WELCOME_CHANNEL_ID"),
    welcomeMessage: readString(
      "DISCORD_WELCOME_MESSAGE",
      "👋 Bem-vindo, {user.mention}, ao **{server.name}**!"
    ),
    leaveEnabled: readBoolean("DISCORD_LEAVE_ENABLED", true),
    leaveChannelId: readString("DISCORD_LEAVE_CHANNEL_ID"),
    leaveMessage: readString(
      "DISCORD_LEAVE_MESSAGE",
      "📤 {user.mention} saiu de **{server.name}**."
    ),
    logLevel: readLogLevel()
  };
}

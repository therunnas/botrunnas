import "dotenv/config";
import type { LogLevel } from "../utils/logger.js";

export type BotEnv = {
  botEnabled: boolean;
  token: string;
  logLevel: LogLevel;
};

const booleanValues = new Set(["true", "false"]);
const logLevels = new Set<LogLevel>(["debug", "info", "warn", "error"]);

export function readEnvString(name: string, fallback = "") {
  return (process.env[name] ?? fallback).trim();
}

export function readEnvBoolean(name: string, fallback: boolean) {
  const raw = readEnvString(name, String(fallback)).toLowerCase();

  if (!booleanValues.has(raw)) {
    throw new Error(`${name} deve ser true ou false.`);
  }

  return raw === "true";
}

export function readEnvNumber(name: string, fallback: number) {
  const raw = readEnvString(name, String(fallback));
  const value = Number(raw);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} deve ser um número maior que zero.`);
  }

  return value;
}

function readLogLevel() {
  const raw = readEnvString("LOG_LEVEL", "info").toLowerCase() as LogLevel;

  if (!logLevels.has(raw)) {
    throw new Error("LOG_LEVEL deve ser debug, info, warn ou error.");
  }

  return raw;
}

export function loadEnv(): BotEnv {
  return {
    botEnabled: readEnvBoolean("DISCORD_BOT_ENABLED", true),
    token: readEnvString("DISCORD_BOT_TOKEN"),
    logLevel: readLogLevel()
  };
}

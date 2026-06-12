export type LogLevel = "debug" | "info" | "warn" | "error";

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

let currentLevel: LogLevel = "info";

function shouldLog(level: LogLevel) {
  return levelOrder[level] >= levelOrder[currentLevel];
}

function write(level: LogLevel, message: string, details?: unknown) {
  if (!shouldLog(level)) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (details === undefined) {
    console[level === "debug" ? "log" : level](`${prefix} ${message}`);
    return;
  }

  console[level === "debug" ? "log" : level](`${prefix} ${message}`, details);
}

export const logger = {
  setLevel(level: LogLevel) {
    currentLevel = level;
  },
  debug(message: string, details?: unknown) {
    write("debug", message, details);
  },
  info(message: string, details?: unknown) {
    write("info", message, details);
  },
  warn(message: string, details?: unknown) {
    write("warn", message, details);
  },
  error(message: string, details?: unknown) {
    write("error", message, details);
  }
};

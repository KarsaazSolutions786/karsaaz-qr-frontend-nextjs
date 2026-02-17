/**
 * Logger Utility
 * Structured logging with log levels, consistent across the app.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel =
  (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === "production" ? "warn" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
}

export const logger = {
  debug: (context: string, message: string, ...args: unknown[]) => {
    if (shouldLog("debug")) console.debug(formatMessage("debug", context, message), ...args);
  },

  info: (context: string, message: string, ...args: unknown[]) => {
    if (shouldLog("info")) console.info(formatMessage("info", context, message), ...args);
  },

  warn: (context: string, message: string, ...args: unknown[]) => {
    if (shouldLog("warn")) console.warn(formatMessage("warn", context, message), ...args);
  },

  error: (context: string, message: string, ...args: unknown[]) => {
    if (shouldLog("error")) console.error(formatMessage("error", context, message), ...args);
  },
};

export default logger;

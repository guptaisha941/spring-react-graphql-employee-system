/**
 * Production-aware logger utility
 * Logs all messages in development, only errors/warnings in production
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');
const currentLogLevel = LOG_LEVELS[logLevel] ?? LOG_LEVELS.info;

function formatMessage(level, message, ...args) {
  const timestamp = new Date().toISOString();
  return `[${level.toUpperCase()}] ${timestamp} - ${message}`;
}

const logger = {
  error: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.error) {
      console.error(formatMessage('error', message, ...args));
    }
  },

  warn: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.warn) {
      console.warn(formatMessage('warn', message, ...args));
    }
  },

  info: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.info) {
      console.log(formatMessage('info', message, ...args));
    }
  },

  debug: (message, ...args) => {
    if (isDevelopment && currentLogLevel >= LOG_LEVELS.debug) {
      console.log(formatMessage('debug', message, ...args));
    }
  },
};

module.exports = logger;

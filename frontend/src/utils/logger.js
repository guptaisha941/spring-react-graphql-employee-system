/**
 * Logger utility for production-ready logging
 * In production, only errors are logged to console
 * In development, all logs are shown
 */

const isDevelopment = import.meta.env.DEV

const logger = {
  error: (message, ...args) => {
    // Always log errors
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, ...args)
    } else {
      // In production, you might want to send to error tracking service
      console.error(`[ERROR] ${message}`)
    }
  },

  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args)
    }
    // Silent in production
  },

  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args)
    }
    // Silent in production
  },

  debug: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
    // Silent in production
  },
}

export default logger

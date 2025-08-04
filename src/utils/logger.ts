// src/utils/logger.ts

/**
 * Logger utility to control console output based on environment
 */
export const logger = {
  /**
   * Log messages in development environment only
   */
  log: (...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  
  /**
   * Debug messages in development environment only
   */
  debug: (...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(...args);
    }
  },
  
  /**
   * Error messages in all environments
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },
  
  /**
   * Warning messages in all environments
   */
  warn: (...args: unknown[]): void => {
    console.warn(...args);
  }
};
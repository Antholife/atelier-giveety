/**
 * Logger utility module
 *
 * Provides environment-aware logging functions that automatically
 * suppress non-critical logs in production while always allowing
 * error logs. This helps keep production logs clean while maintaining
 * debugging capabilities during development.
 */
/* eslint-disable no-console */

/**
 * Environment check for production mode
 *
 * Determines if the application is running in production mode.
 * Used to conditionally disable non-critical logging.
 */
const isProduction = process.env.NODE_ENV === "production";

/**
 * Log arguments type
 *
 * Represents the arguments that can be passed to logging functions.
 * Accepts any number of values of any type, matching console API signatures.
 */
type LogArgs = unknown[];

/**
 * Logs a message to the console
 *
 * Outputs a standard log message. In production mode, this function
 * does nothing to keep logs clean. In development, it forwards to
 * console.log.
 *
 * @param args - Arguments to log (any type, any number)
 *
 * @example
 * ```typescript
 * log("User logged in", { userId: 123 });
 * log("Processing data:", data);
 * ```
 */
export const log = (...args: LogArgs): void => {
  if (isProduction) {
    return;
  }

  console.log(...args);
};

/**
 * Logs a warning message to the console
 *
 * Outputs a warning message. In production mode, this function
 * does nothing to keep logs clean. In development, it forwards to
 * console.warn.
 *
 * @param args - Arguments to log as warning (any type, any number)
 *
 * @example
 * ```typescript
 * warn("Deprecated API used", { endpoint: "/old-api" });
 * warn("Missing configuration:", config);
 * ```
 */
export const warn = (...args: LogArgs): void => {
  if (isProduction) {
    return;
  }

  console.warn(...args);
};

/**
 * Logs an error message to the console
 *
 * Outputs an error message. Unlike other logging functions, errors
 * are always logged regardless of environment, as they are critical
 * for debugging production issues.
 *
 * @param args - Arguments to log as error (any type, any number)
 *
 * @example
 * ```typescript
 * error("Failed to fetch data", error);
 * error("Validation failed:", validationErrors);
 * ```
 */
export const error = (...args: LogArgs): void => {
  console.error(...args);
};

/**
 * Logs a debug message to the console
 *
 * Outputs a debug message. In production mode, this function
 * does nothing to keep logs clean. In development, it forwards to
 * console.debug.
 *
 * @param args - Arguments to log for debugging (any type, any number)
 *
 * @example
 * ```typescript
 * debug("Component rendered", { props });
 * debug("State updated:", newState);
 * ```
 */
export const debug = (...args: LogArgs): void => {
  if (isProduction) {
    return;
  }

  console.debug(...args);
};

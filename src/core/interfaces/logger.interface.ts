/**
 * Logger interface defining standard logging methods
 */
export interface ILogger {
  /**
   * Log trace level message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  trace(message: string, ...meta: any[]): void;

  /**
   * Log debug level message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  debug(message: string, ...meta: any[]): void;

  /**
   * Log info level message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  info(message: string, ...meta: any[]): void;

  /**
   * Log warning level message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  warn(message: string, ...meta: any[]): void;

  /**
   * Log error level message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  error(message: string, ...meta: any[]): void;

  /**
   * Log fatal level message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  fatal(message: string, ...meta: any[]): void;
}

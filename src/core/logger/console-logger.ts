import type { ILogger } from '../interfaces/logger.interface.js';

/**
 * Console-based logger implementation
 */
export class ConsoleLogger implements ILogger {
  /**
   * Default logger trace behavior is overly verbose
   * @param message - Log message
   * @param args - Additional arguments
   */
  trace(message: string, ...args: any[]): void {
    console.trace(message, ...args);
  }

  /**
   * Log debug message
   * @param message - Log message
   * @param args - Additional arguments
   */
  debug(message: string, ...args: any[]): void {
    console.debug(message, ...args);
  }

  /**
   * Log info message
   * @param message - Log message
   * @param args - Additional arguments
   */
  info(message: string, ...args: any[]): void {
    console.info(message, ...args);
  }

  /**
   * Log warning message
   * @param message - Log message
   * @param args - Additional arguments
   */
  warn(message: string, ...args: any[]): void {
    console.warn(message, ...args);
  }

  /**
   * Log error message
   * @param message - Log message
   * @param args - Additional arguments
   */
  error(message: string, ...args: any[]): void {
    console.error(message, ...args);
  }

  /**
   * Default logger does not recognize fatal, use error instead
   * @param message - Log message
   * @param args - Additional arguments
   */
  fatal(message: string, ...args: any[]): never {
    throw new Error(
      `Fatal is not supported by the default (console) logger.\n${message}\n${args}`
    );
  }
}

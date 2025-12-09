import type { ILogger } from '../interfaces/logger.interface.js';
import { WinstonLogger } from '../logger/winston-logger.js';
import { MockLogger } from '../logger/mock-logger.js';
import { ConsoleLogger } from '../logger/console-logger.js';

/**
 * Factory for creating logger instances based on environment configuration
 */
export class LoggerFactory {
  /**
   * Get logger instance based on LOGGER_TYPE environment variable
   * @returns Logger instance
   */
  static getLoggerProvider(): ILogger {
    const loggerType = process.env['LOGGER_TYPE'] || 'winston';

    switch (loggerType) {
      case 'winston':
        return new WinstonLogger();

      case 'default':
        return new ConsoleLogger();

      case 'test':
        return new MockLogger();

      default:
        return new ConsoleLogger();
    }
  }
}

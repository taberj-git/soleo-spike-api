import winston from 'winston';
import type { ILogger } from '../interfaces/logger.interface.js';
import { myCustomLevels, type CustomLevels } from '../../config/log.config.js';

type CustomWinstonLogger = winston.Logger &
  Record<keyof CustomLevels, winston.LeveledLogMethod>;

/**
 * Winston-based logger implementation with custom log levels
 */
export class WinstonLogger implements ILogger {
  private logger: CustomWinstonLogger;

  constructor() {
    this.logger = winston.createLogger({
      levels: myCustomLevels.levels,
      format: winston.format.combine(
        winston.format.colorize({ colors: myCustomLevels.colors }),
        winston.format.timestamp(),
        winston.format.printf(
          ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`
        )
      ),
      transports: [new winston.transports.Console()],
    }) as CustomWinstonLogger;
  }

  trace(message: string, ...meta: any[]): void {
    this.logger.trace(message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }

  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  fatal(message: string, ...meta: any[]): void {
    this.logger.fatal(message, ...meta);
  }
}

import type { ILogger } from '../interfaces/logger.interface.js';

/**
 * Mock logger implementation for unit testing
 */
export class MockLogger implements ILogger {
  trace(message: string, ...meta: any[]): void {
    console.log(`\nmessage ${message}\nmeta${meta}`);
  }

  debug(message: string, ...meta: any[]): void {
    console.log(`\nmessage ${message}\nmeta${meta}`);
  }

  info(message: string, ...meta: any[]): void {
    console.log(`\nmessage ${message}\nmeta${meta}`);
  }

  warn(message: string, ...meta: any[]): void {
    console.log(`\nmessage ${message}\nmeta${meta}`);
  }

  error(message: string, ...meta: any[]): void {
    console.log(`\nmessage ${message}\nmeta${meta}`);
  }

  fatal(message: string, ...meta: any[]): void {
    console.log(`\nmessage ${message}\nmeta${meta}`);
  }
}

import type { IAccess } from '../interfaces/access.interface.js';
import type { ILogger } from '../interfaces/logger.interface.js';
import { AzureAuthenticator } from '../middleware/access/azure-access.js';

/**
 * Factory for creating authenticator instances
 */
export class AuthFactory {
  /**
   * Get authenticator instance based on AUTH_TYPE environment variable
   * @param logger - Logger instance
   * @returns Authenticator instance
   */
  static getAuthenticator(logger: ILogger): IAccess {
    const authType = process.env['AUTH_TYPE'] || 'azure';

    switch (authType) {
      case 'azure':
        return new AzureAuthenticator(logger);

      default:
        return new AzureAuthenticator(logger);
    }
  }
}

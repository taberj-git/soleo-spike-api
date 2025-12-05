import type { IAuthentication } from '../interfaces/auth.interface.js';
import type { ILogger } from '../interfaces/logger.interface.js';
import { AzureAuthenticator } from '../middleware/authentication/azure-authenticator.js';

/**
 * Factory for creating authenticator instances
 */
export class AuthFactory {
  /**
   * Get authenticator instance based on AUTH_TYPE environment variable
   * @param logger - Logger instance
   * @returns Authenticator instance
   */
  static getAuthenticator(logger: ILogger): IAuthentication {
    const authType = process.env['AUTH_TYPE'] || 'azure';

    switch (authType) {
      case 'azure':
        return new AzureAuthenticator(logger);

      default:
        return new AzureAuthenticator(logger);
    }
  }
}

import type { IAccess } from '../interfaces/access.interface.js';
import type { ILogger } from '../interfaces/logger.interface.js';
import { AzureAuthenticator } from '../middleware/access/azure-access.js';
import { getServerConfig } from "../../config/index.js";

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
   
    const provider = getServerConfig().accessProvider;

    switch (provider) {
      case 'AZURE':
        return new AzureAuthenticator(logger);

      default:
        return new AzureAuthenticator(logger);
    }
  }
}

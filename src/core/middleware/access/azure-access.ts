import type {
  IAccess,
} from '../../interfaces/access.interface.js';
import type {
  IAuthenticatonResponse,
  ILoginResponse,
  ILogoutResponse
} from "../../../api/v1/interfaces/access.response.interface.js";
import type { ILogger } from '../../interfaces/logger.interface.js';

/**
 * Azure-based authentication provider
 */
export class AzureAccess implements IAccess {
  private logger: ILogger;

  constructor(_logger: ILogger) {
    this.logger = _logger;
  }

  /**
   * Log in user with username and password
   * @param username - User's username
   * @param _password - User's password (unused in mock)
   * @returns Promise<ILoginResponse>
   */
  login(username: string, _password: string): Promise<ILoginResponse> {
    this.logger.trace(
      `enter AzureAuthenticator.login() for ${username}`
    ); 

    const response: ILoginResponse = {
      success: true,
      token: 'mock-jwt-token',
      userId: '12345',
      userType: 'patient',
    };
    this.logger.trace(`exit AzureAuthenticator.login`);

    return Promise.resolve(response);
  }

  /**
   * Logout user
   * @param userId - User's ID - this maybe different from username; a system dependent ID 
   * @returns Promise<ILogoutResponse>
   */
  logout(userId: string): Promise<ILogoutResponse> {
    this.logger.trace(`enter AzureAuthenticator.logout() for ${userId}`);

    const response: ILogoutResponse = {
      success: true,
      userId: '12345',
    };

    this.logger.trace(`exit AzureAuthenticator.logout`);
    return Promise.resolve(response);
  }

  /**
   * Verify authentication token
   * @param _token - Authentication token (unused in mock)
   * @param userId - User's ID
   * @returns Promise<IAuthResponse>
   */
  authenticate(_token: string, userId: string): Promise<IAuthenticatonResponse> {
    this.logger.trace(
      `enter AzureAuthenticator.authenticate() for ${userId}`);

    const response: IAuthenticatonResponse = {
      success: true,
      userId: '12345',
    };

    this.logger.trace(`exit AzureAuthenticator.authenticate`);
    return Promise.resolve(response);
  }
}

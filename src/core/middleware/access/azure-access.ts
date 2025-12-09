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
export class AzureAuthenticator implements IAccess {
  private logger: ILogger;

  constructor(_logger: ILogger) {
    this.logger = _logger;
  }

  /**
   * Authenticate user with username and password
   * @param username - User's username
   * @param password - User's password
   * @returns Promise<ILoginResponse>
   */
  login(username: string, password: string): Promise<ILoginResponse> {
    this.logger.trace(
      `enter AzureAuthenticator.login(username: ${username}) password ${password}`
    ); // TODO REMOVE PW LOGGING BEFORE PRODUCTION

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
   * @param userId - User's ID
   * @returns Promise<ILogoutResponse>
   */
  logout(userId: string): Promise<ILogoutResponse> {
    this.logger.trace(`enter AzureAuthenticator.logout(userId: ${userId})`);

    const response: ILogoutResponse = {
      success: true,
      userId: '12345',
    };

    this.logger.trace(`exit AzureAuthenticator.logout`);
    return Promise.resolve(response);
  }

  /**
   * Verify authentication token
   * @param token - Authentication token
   * @param userId - User's ID
   * @returns Promise<IAuthResponse>
   */
  authenticate(token: string, userId: string): Promise<IAuthenticatonResponse> {
    this.logger.trace(
      `enter AzureAuthenticator.authenticate(token: ${token}, userId: ${userId})`
    );

    const response: IAuthenticatonResponse = {
      success: true,
      userId: '12345',
    };

    this.logger.trace(`exit AzureAuthenticator.authenticate`);
    return Promise.resolve(response);
  }
}

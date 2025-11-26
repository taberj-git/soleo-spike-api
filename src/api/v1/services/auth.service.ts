import type {
  IAuthenticator,
  IAuthResponse,
  ILoginResponse,
  ILogoutResponse,
} from '../../../core/interfaces/auth.interface.js';
import type { ILogger } from '../../../core/interfaces/logger.interface.js';
import type { IAuthService } from '../interfaces/auth.interface.js';
import { stringify } from 'flatted';
import type { Request } from 'express';

/**
 * Authentication service handling business logic
 */
export class AuthService implements IAuthService {
  authenticator: IAuthenticator;
  logger: ILogger;

  /**
   * Constructor
   * @param _logger - Logger instance
   * @param _authenticator - Authenticator instance
   */
  constructor(_logger: ILogger, _authenticator: IAuthenticator) {
    this.authenticator = _authenticator;
    this.logger = _logger;
  }

  /**
   * Process login request
   * @param req - Express request object
   * @returns Promise<ILoginResponse>
   */
  login = async (req: Request): Promise<ILoginResponse> => {
    this.logger.trace(`enter AuthService.login with ${stringify(req.body)}`);

    // may need to do some sort of cyber security check here.

    const { username, password } = req.body;
    let response: ILoginResponse;
    try {
      response = (await this.authenticator.login(
        username,
        password
      )) as ILoginResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Exit AuthService.login caught an error:', error.message);
        throw error;
      } else {
        this.logger.error(
          `Exit AuthService.login an unexpected error occurred: ${String(error)}`
        );
        throw new Error(
          `Exit AuthService.login an unexpected error occurred: ${String(error)}`
        );
      }
    }

    this.logger.trace('exit AuthService.login');
    return response;
  };

  /**
   * Process logout request
   * @param req - Express request object
   * @returns Promise<ILogoutResponse>
   */
  async logout(req: Request): Promise<ILogoutResponse> {
    this.logger.trace(`enter AuthService.logout with ${stringify(req.body)}`);

    let response: ILogoutResponse;
    try {
      const userId = (req.headers['user-id'] as string) || 'unknown';
      response = (await this.authenticator.logout(userId)) as ILogoutResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Exit AuthService.logout caught an error:', error.message);
        throw error;
      } else {
        this.logger.error(
          `Exit AuthService.logout an unexpected error occurred: ${String(error)}`
        );
        throw new Error(
          `Exit AuthService.logout an unexpected error occurred: ${String(error)}`
        );
      }
    }

    this.logger.trace('exit AuthService.logout');
    return response;
  }

  /**
   * Process authentication request
   * @param req - Express request object
   * @returns Promise<IAuthResponse>
   */
  async authenticate(req: Request): Promise<IAuthResponse> {
    this.logger.trace(`enter AuthService.authenticate with ${stringify(req.body)}`);

    const token = req.headers['authorization']?.replace('Bearer ', '') || '';
    const userId = (req.headers['user-id'] as string) || 'unknown';
    let response: IAuthResponse;

    try {
      response = (await this.authenticator.authenticate(
        token,
        userId
      )) as IAuthResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          'Exit AuthService.authenticate caught an error:',
          error.message
        );
        throw error;
      } else {
        this.logger.error(
          `Exit AuthService.authenticate an unexpected error occurred: ${String(error)}`
        );
        throw new Error(
          `Exit AuthService.authenticate an unexpected error occurred: ${String(error)}`
        );
      }
    }

    this.logger.trace('exit AuthService.authenticate');
    return response;
  }
}

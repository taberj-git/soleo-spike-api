import type { Request } from 'express';
import type {
  IAuthResponse,
  ILoginResponse,
  ILogoutResponse,
} from '../../../core/interfaces/auth.interface.js';
import type { IAuthController, IAuthService } from '../interfaces/auth.interface.js';
import type { ILogger } from '../../../core/interfaces/logger.interface.js';
import { stringify } from 'flatted';

/**
 * Authentication controller handling HTTP requests
 */
export class AuthController implements IAuthController {
  private authService: IAuthService;
  private logger: ILogger;

  constructor(_logger: ILogger, _authService: IAuthService) {
    this.authService = _authService;
    this.logger = _logger;
  }

  /**
   * Handle login endpoint
   * @param req - Express request object
   * @returns Promise<ILoginResponse>
   */
  login = async (req: Request): Promise<ILoginResponse> => {
    this.logger.trace(`enter AuthController.login with ${stringify(req.body)}`);

    let response: ILoginResponse;
    try {
      response = (await this.authService.login(req)) as ILoginResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Exit AuthController.login caught an error:', error.message);
        throw error;
      } else {
        this.logger.error(
          `Exit AuthController.login an unexpected error occurred: ${String(error)}`
        );
        throw new Error(
          `Exit AuthController.login an unexpected error occurred: ${String(error)}`
        );
      }
    }

    this.logger.trace('exit AuthController.login');
    return response;
  };

  /**
   * Handle logout endpoint
   * @param req - Express request object
   * @returns Promise<ILogoutResponse>
   */
  logout = async (req: Request): Promise<ILogoutResponse> => {
    this.logger.trace(`enter AuthController.logout with ${stringify(req.body)}`);

    let response: ILogoutResponse;
    try {
      response = (await this.authService.logout(req)) as ILogoutResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Exit AuthController.logout caught an error:', error.message);
        throw error;
      } else {
        throw new Error(
          `Exit AuthController.logout an unexpected error occurred: ${String(error)}`
        );
      }
    }
    this.logger.trace('exit AuthController.logout');
    return response;
  };

  /**
   * Handle authentication endpoint
   * @param req - Express request object
   * @returns Promise<IAuthResponse>
   */
  authenticate = async (req: Request): Promise<IAuthResponse> => {
    this.logger.trace(
      `enter AuthController.authenticate(${req.headers['authorization']?.replace('Bearer ', '') || ''})`
    );

    let response: IAuthResponse;
    try {
      response = (await this.authService.authenticate(req)) as IAuthResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          'Exit AuthController.authenticate caught an error:',
          error.message
        );
        throw error;
      } else {
        throw new Error(
          `Exit AuthController.authenticate an unexpected error occurred: ${String(error)}`
        );
      }
    }

    this.logger.trace('exit AuthController.authenticate');
    return response;
  };
}

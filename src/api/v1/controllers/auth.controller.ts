import type { Request, Response, NextFunction } from 'express';
import type {
  IAuthenticatonResponse,
  ILoginResponse,
  ILogoutResponse,
  IAuthenticationController,
  IAuthenticationService
} from '../../../core/interfaces/auth.interface.js';
import type { ILogger } from '../../../core/interfaces/logger.interface.js';
import { stringify } from 'flatted';
import { toError } from '../../../core/util/error.util.js';

/**
 * Authentication controller handling login/logout/etc requests.  Used by the router to 
 * move requests to the service 
 */
export class AuthenticatorController implements IAuthenticationController {
  private authService: IAuthenticationService;
  private logger: ILogger;

  constructor(_logger: ILogger, _authService: IAuthenticationService) {
    this.authService = _authService;
    this.logger = _logger;
  }

  /**
   * Handle login endpoint
   * @param req - Express request object
   * @returns Promise<ILoginResponse>
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.trace(`enter AuthController.login with ${stringify(req.body)}`);

    let response: ILoginResponse;
    const { username, password } = req.body;

    //TODO may need to add cyber security checks, etc before passing to service
    //TODO does using dedicated objects for json back from service/provider make sense?
    try {
      response = (await this.authService.login(username, password)) as ILoginResponse;
      res.cookie('auth_token', response.token, { httpOnly: true });
      res.status(200).json(response);
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error('Exit AuthController.login caught an error:', err.message);
      next(err);  //push to global error handler
    }
    this.logger.trace('exit AuthController.login');
  };

  /**
   * Handle logout endpoint
   * @param req - Express request object
   * @returns Promise<ILogoutResponse>
   */
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.trace(`enter AuthController.logout with ${stringify(req.body)}`);

    const userId = (req.headers['user-id'] as string) || 'unknown';
    let response: ILogoutResponse;
    try {
      response = (await this.authService.logout(userId)) as ILogoutResponse;
      res.status(200).json(response);
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error('Exit AuthController.login caught an error:', err.message);
      next(err);  //push to global error handler
    }
    this.logger.trace('exit AuthController.logout');
  };

  /**
   * Handle authentication endpoint
   * @param req - Express request object
   * @returns Promise<IAuthResponse>
   */
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.trace(`enter AuthController.authenticate`);
    
    //may need to add some cyber security code here, ask the guild.
    const token = req.headers['authorization']?.replace('Bearer ', '') || '';
    const userId = (req.headers['user-id'] as string) || 'unknown';
    let response: IAuthenticatonResponse;
    try {
      response = (await this.authService.authenticate(token, userId)) as IAuthenticatonResponse;
      res.status(200).json(response);
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error('Exit AuthController.login caught an error:', err.message);
      next(err);  //push to global error handler
    }
    this.logger.trace('exit AuthController.authenticate');
  };
}

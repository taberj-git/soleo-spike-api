import type { Request } from 'express';
import type {
  IAuthResponse,
  ILoginResponse,
  ILogoutResponse,
} from '../../../core/interfaces/auth.interface.js';

/**
 * Auth service interface - business logic layer
 */
export interface IAuthService {
  /**
   * Process login request
   * @param req - Express request object
   */
  login(req: Request): Promise<ILoginResponse>;

  /**
   * Process logout request
   * @param req - Express request object
   */
  logout(req: Request): Promise<ILogoutResponse>;

  /**
   * Process authentication request
   * @param req - Express request object
   */
  authenticate(req: Request): Promise<IAuthResponse>;
}

/**
 * Auth controller interface - request/response handling layer
 */
export interface IAuthController {
  /**
   * Handle login endpoint
   * @param req - Express request object
   */
  login(req: Request): Promise<ILoginResponse>;

  /**
   * Handle logout endpoint
   * @param req - Express request object
   */
  logout(req: Request): Promise<ILogoutResponse>;

  /**
   * Handle authentication endpoint
   * @param req - Express request object
   */
  authenticate(req: Request): Promise<IAuthResponse>;
}

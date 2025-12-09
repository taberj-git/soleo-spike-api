/**
 * Contains all the interfaces for the access control chain:
 *    Service
 *    Controller
 *    Provider specific access control
 * The interfaces allow dependancy injection for testing using mocks, etc.
 */

import type { Request, Response, NextFunction } from "express";
import type {
  ILoginResponse,
  ILogoutResponse,
  IAuthenticatonResponse,
} from "../../api/v1/interfaces/access.response.interface.js";

/**
 * Authentication Controller interface - provides traffic control between router and service
 */
export interface IAccessController {
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  login(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * Authentication Service interface - provides the hand-off between the router-controller
 * chain and the provider specific (ie. Azure) authenication code
 */
export interface IAccessService {
  /**
   *
   * @param username
   * @param password
   */
  login(username: string, password: string): Promise<ILoginResponse>;

  /**
   *
   * @param userId
   */
  logout(userId: string): Promise<ILogoutResponse>;

  /**
   *
   * @param token
   * @param userId
   */
  authenticate(token: string, userId: string): Promise<IAuthenticatonResponse>;
}

/**
 * Access interface - handles actual access control logic in the middleware; implemented for each provider
 */
export interface IAccess {
  /**
   * Login user with username and password
   * @param username - User's username
   * @param password - User's password
   */
  login(username: string, password: string): Promise<ILoginResponse>;

  /**
   * Logout user
   * @param userId - User's ID
   */
  logout(userId: string): Promise<ILogoutResponse>;

  /**
   * Verify user
   * @param token - Authentication token
   * @param userId - User's ID
   */
  authenticate(token: string, userId: string): Promise<IAuthenticatonResponse>;
}

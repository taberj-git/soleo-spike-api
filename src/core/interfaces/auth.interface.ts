/**
 * Contains all the interfaces for the authentication chain:
 *    Service
 *    Controller
 *    Provider specific authenticator
 *    Reponses for the authenticator behaviors
 * The interfaces allow dependancy injection for testing using mocks, etc.
 * TODO: revisit with architecture to determine if they are all required and if any
 * should move from core to api/v1.
 */

import type { Request, Response, NextFunction } from "express";

/**
 * Login response interface
 */
export interface ILoginResponse {
  success: boolean;
  token: string;
  userId: string;
  userType: string;
}

/**
 * Logout response interface
 */
export interface ILogoutResponse {
  success: boolean;
  userId: string;
}

/**
 * Authentication response interface
 */
export interface IAuthenticatonResponse {
  success: boolean;
  userId: string;
}

/**
 * Authentication Controller interface - provides traffic control between router and service
 */
export interface IAuthenticationController {
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
export interface IAuthenticationService {
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
 * Authenticator interface - handles actual authentication logic in the middleware
 */
export interface IAuthentication {
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

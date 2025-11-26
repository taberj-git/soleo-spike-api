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
export interface IAuthResponse {
  success: boolean;
  userId: string;
}

/**
 * Authenticator interface - handles actual authentication logic
 */
export interface IAuthenticator {
  /**
   * Authenticate user with username and password
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
   * Verify authentication token
   * @param token - Authentication token
   * @param userId - User's ID
   */
  authenticate(token: string, userId: string): Promise<IAuthResponse>;
}


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

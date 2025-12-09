import type {
  IAccess,
  IAccessService,
} from "../../../core/interfaces/access.interface.js";
import type {
  IAuthenticatonResponse,
  ILoginResponse,
  ILogoutResponse
} from "../interfaces/access.response.interface.js";
import type { ILogger } from "../../../core/interfaces/logger.interface.js";
import { toError } from "../../../core/utilities/error.utility.js";

/**
 * Authentication service handling business logic
 */
export class AuthenticatorService implements IAccessService {
  authenticator: IAccess;
  logger: ILogger;

  /**
   * Constructor
   * @param _logger - Logger instance
   * @param _authenticator - Authenticator instance (provider specific)
   */
  constructor(_logger: ILogger, _authenticator: IAccess) {
    this.authenticator = _authenticator;
    this.logger = _logger;
  }

  /**
   * Process login request
   * @param req - Express request object
   * @returns Promise<ILoginResponse>
   */
  login = async (
    username: string,
    password: string
  ): Promise<ILoginResponse> => {
    this.logger.trace(`enter AuthService.login with username ${username}`);

    let response: ILoginResponse;
    try {
      response = (await this.authenticator.login(
        username,
        password
      )) as ILoginResponse;
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit AuthenticatorService.login caught an error:",
        err.message
      );
      throw err;
    }

    this.logger.trace("exit AuthService.login");
    return response;
  };

  /**
   * Process logout request
   * @param userId
   * @returns Promise<ILogoutResponse>
   */
  async logout(userId: string): Promise<ILogoutResponse> {
    this.logger.trace(`enter AuthService.logout with userId ${userId}`);

    let response: ILogoutResponse;
    try {
      response = (await this.authenticator.logout(userId)) as ILogoutResponse;
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit AuthenticatorService.logout caught an error:",
        err.message
      );
      throw err;
    }

    this.logger.trace("exit AuthService.logout");
    return response;
  }

  /**
   * Process authentication request
   * @param req - Express request object
   * @returns Promise<IAuthResponse>
   */
  async authenticate(
    token: string,
    userId: string
  ): Promise<IAuthenticatonResponse> {
    this.logger.trace(`enter AuthService.authenticate for ${userId}`);

    let response: IAuthenticatonResponse;
    try {
      response = (await this.authenticator.authenticate(
        token,
        userId
      )) as IAuthenticatonResponse;
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit AuthenticatorService.authenticate caught an error:",
        err.message
      );
      throw err;
    }

    this.logger.trace("exit AuthService.authenticate");
    return response;
  }
}

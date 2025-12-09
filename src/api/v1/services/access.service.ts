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
export class AccessService implements IAccessService {
  access: IAccess;
  logger: ILogger;

  /**
   * Constructor
   * @param logger - Logger instance
   * @param access - Access instance (provider specific - use factory to discover)
   */
  constructor(logger: ILogger, access: IAccess) {
    this.access = access;
    this.logger = logger;
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
    this.logger.trace(`enter AccessService.login with username ${username}`);

    let response: ILoginResponse;
    try {
      response = (await this.access.login(
        username,
        password
      )) as ILoginResponse;
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit AccessService.login caught an error:",
        err.message
      );
      throw err;
    }

    this.logger.trace("exit AccessService.login");
    return response;
  };

  /**
   * Process logout request
   * @param userId
   * @returns Promise<ILogoutResponse>
   */
  async logout(userId: string): Promise<ILogoutResponse> {
    this.logger.trace(`enter AccessService.logout with userId ${userId}`);

    let response: ILogoutResponse;
    try {
      response = (await this.access.logout(userId)) as ILogoutResponse;
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit Accesservice.logout caught an error:",
        err.message
      );
      throw err;
    }

    this.logger.trace("exit AccessService.logout");
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
    this.logger.trace(`enter AccessService.authenticate for ${userId}`);

    let response: IAuthenticatonResponse;
    try {
      response = (await this.access.authenticate(
        token,
        userId
      )) as IAuthenticatonResponse;
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit AccessService.authenticate caught an error:",
        err.message
      );
      throw err;
    }

    this.logger.trace("exit AccessService.authenticate");
    return response;
  }
}

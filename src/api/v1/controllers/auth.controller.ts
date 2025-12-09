import type { Request, Response, NextFunction } from "express";
import type {
  IAccessController,
  IAccessService,
} from "../../../core/interfaces/access.interface.js";
import type {
  IAuthenticatonResponse,
  ILoginResponse,
  ILogoutResponse,
} from "../interfaces/access.response.interface.js";
import type { ILogger } from "../../../core/interfaces/logger.interface.js";
import { toError } from "../../../core/utilities/error.utility.js";

/**
 * Authentication controller handling login/logout/etc requests.  Used by the router to
 * move requests to the service
 */
export class AccessController implements IAccessController {
  private authService: IAccessService;
  private logger: ILogger;

  constructor(_logger: ILogger, _authService: IAccessService) {
    this.authService = _authService;
    this.logger = _logger;
  }

  /**
   * Handle login endpoint
   * @param req - Express request object
   * @returns Promise<ILoginResponse>
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.trace(`enter AccessController.login()`);

    let response: ILoginResponse;
    const { username, password } = req.body;

    if (
      !username ||
      typeof username !== "string" ||
      username.length < 3 ||
      username.length > 50
    ) {
      const err = new Error(`Invalid username format`);
      this.logger.error(
        "Exit AccessController.login caught an error:",
        err.message
      );
      res
        .status(400)
        .json({ success: false, error: "Invalid username format" });
      next(err);
      return;
    }

    if (
      !password ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      const err = new Error(`Invalid password format`);
      this.logger.error(
        "Exit AccessController.login caught an error:",
        err.message
      );
      res
        .status(400)
        .json({ success: false, error: "Invalid password format" });
      next(err);
      return;
    }

    // Sanitize username (alphanumeric only)
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      const err = new Error(`Invalid password format`);
      this.logger.error(
        "Exit AccessController.login caught an error:",
        err.message
      );
      res
        .status(400)
        .json({
          success: false,
          error: "Username contains invalid characters",
        });
      next(err);
      return;
    }

    try {
      response = (await this.authService.login(
        username,
        password
      )) as ILoginResponse;
      res.cookie("auth_token", response.token, { httpOnly: true });
      res.status(200).json(response);
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit AccessController.login caught an error:",
        err.message
      );
      next(err); //push to global error handler
    }
    this.logger.trace("exit AccessController.login");
  };

  /**
   * Handle logout endpoint
   * @param req - Express request object
   * @returns Promise<ILogoutResponse>
   */
  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.trace(`enter AccessController.logout()`);

    const userId = (req.headers["user-id"] as string) || "unknown";
    let response: ILogoutResponse;
    try {
      response = (await this.authService.logout(userId)) as ILogoutResponse;
      res.status(200).json(response);
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit AccessController.login caught an error:",
        err.message
      );
      next(err); //push to global error handler
    }
    this.logger.trace("exit AccessController.logout");
  };

  /**
   * Handle authentication endpoint
   * @param req - Express request object
   * @returns Promise<IAuthResponse>
   */
  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.trace(`enter AccessController.authenticate()`);

    //may need to add some cyber security code here, ask the guild.
    const token = req.headers["authorization"]?.replace("Bearer ", "") || "";
    const userId = (req.headers["user-id"] as string) || "unknown";

    // Validate token format
    if (!token || token.length < 10) {
      const err = new Error(`Invalid token format`);
      this.logger.error(
        "Exit AccessController.authenticate caught an error:",
        err.message
      );
      res.status(401).json({ success: false, error: "Invalid token format" });
      next(err);
      return;
    }

    // Validate userId format
    if (!userId || !/^[a-zA-Z0-9-]+$/.test(userId)) {
      const err = new Error(`Invalid user ID format`);
      this.logger.error(
        "Exit AccessController.authenticate caught an error:",
        err.message
      );
      res.status(401).json({ success: false, error: "Invalid user ID format" });
      next(err);
      return;
    }

    let response: IAuthenticatonResponse;
    try {
      response = (await this.authService.authenticate(
        token,
        userId
      )) as IAuthenticatonResponse;
      res.status(200).json(response);
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit AccessController.login caught an error:",
        err.message
      );
      next(err); //push to global error handler
    }
    this.logger.trace("exit AccessController.authenticate");
  };
}

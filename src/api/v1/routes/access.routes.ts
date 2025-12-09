import express from 'express';
import type { ILogger } from '../../../core/interfaces/logger.interface.js';
import type { IAccessController } from '../../../core/interfaces/access.interface.js'
import { getErrorMessage } from "../../../core/utilities/error.utility.js"

/**
 * Create and configure access router
 * @param logger - Logger instance
 * @param controller - Auth controller instance
 * @returns Express router
 */
export function createAccessRouter(logger: ILogger, controller: IAccessController) {
  logger.trace("Enter access.routes.createAccessRouter");
  const router = express.Router();

  /**
   * Login endpoint
   */
  router.post('/login', async (req, res, next) => {
    logger.trace('access.routes /login route hit, forwarding to controller');
    try {
      const response = await controller.login(req, res, next);
      res.json(response);
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error(`access.routes /login error: ${message}`);
      res.status(500).json({ success: false, error: `login failed: ${message}` });
    }
  });

  /**
   * Logout endpoint
   */
  router.post('/logout', async (req, res, next) => {
    logger.trace('access.routes /logout route hit, forwarding to controller');
    try {
      const response = await controller.logout(req, res, next);
      res.json(response);
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error(`access.routes /logout error: ${message}`);
      res.status(500).json({ success: false, error: `Logout failed: ${message}` });
    }
  });

  /**
   * Authorize endpoint
   */
  router.post('/authorize', async (req, res, next) => {
    logger.trace('access.routes /authorize route hit, forwarding to controller');
    try {
      const response = await controller.authenticate(req, res, next);
      res.json(response);
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error('access.routes /authorize error:', err);
      res.status(401).json({ success: false, error: `Authorization failed: ${message}` });
    }
  });

  return router;
}

import express from 'express';
import type { ILogger } from '../../../core/interfaces/logger.interface.js';
import type { IAuthController } from '../interfaces/auth.interface.js';

/**
 * Create and configure authentication router
 * @param logger - Logger instance
 * @param controller - Auth controller instance
 * @returns Express router
 */
export function createAuthRouter(logger: ILogger, controller: IAuthController) {
  logger.info('AuthRouter: Initializing auth routes');

  const router = express.Router();

  /**
   * Login endpoint
   */
  router.post('/login', async (req, res) => {
    logger.trace('[AuthRouter] /login route hit, forwarding to controller');
    try {
      const response = await controller.login(req);
      res.json(response);
    } catch (error) {
      logger.error('[AuthRouter] /login error:', error);
      res.status(500).json({ success: false, error: 'Login failed' });
    }
  });

  /**
   * Logout endpoint
   */
  router.post('/logout', async (req, res) => {
    logger.trace('[AuthRouter] /logout route hit, forwarding to controller');
    try {
      const response = await controller.logout(req);
      res.json(response);
    } catch (error) {
      logger.error('[AuthRouter] /logout error:', error);
      res.status(500).json({ success: false, error: 'Logout failed' });
    }
  });

  /**
   * Authorize endpoint
   */
  router.post('/authorize', async (req, res) => {
    logger.trace('[AuthRouter] /authorize route hit, forwarding to controller');
    try {
      const response = await controller.authenticate(req);
      res.json(response);
    } catch (error) {
      logger.error('[AuthRouter] /authorize error:', error);
      res.status(401).json({ success: false, error: 'Authorization failed' });
    }
  });

  return router;
}

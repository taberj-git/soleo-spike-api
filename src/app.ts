import express from 'express';
import cors from 'cors';
import { corsConfig } from './config/index.js';
import { LoggerFactory } from './core/factories/logger.factory.js';
import { AuthFactory } from './core/factories/auth.factory.js';
import { AuthService } from './api/v1/services/auth.service.js';
import { AuthController } from './api/v1/controllers/auth.controller.js';
import { createAuthRouter } from './api/v1/routes/auth.routes.js';

const logger = LoggerFactory.getLogger();

logger.trace('Soleo API: Initializing application...');

/**
 * Create and configure Express application
 * @returns Configured Express app
 */
export function createApp() {
  const app = express();

  // Middleware
  app.use(cors(corsConfig));
  app.use(express.json());

  // Request logging middleware
  app.use((req, _res, next) => {
    logger.trace(
      `\nIncoming ${req.method} request to ${req.path} with body ${JSON.stringify(req.body)}`
    );
    next();
  });

  // Initialize authentication components
  const authenticator = AuthFactory.getAuthenticator(logger);
  const authService = new AuthService(logger, authenticator);
  const authController = new AuthController(logger, authService);

  // Root endpoint
  app.get('/', (req, res) => {
    logger.trace(`Root endpoint hit: ${req.method} ${req.path}`);
    res.send('Hello from Soleo API!');
  });

  // Mount API v1 routes
  logger.info('App: Mounting /api/v1/auth routes...');
  const authRoutes = createAuthRouter(logger, authController);
  app.use('/api/v1/auth', authRoutes);

  return app;
}

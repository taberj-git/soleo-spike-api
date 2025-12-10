import {
    accessLimiter,
    apiLimiter,
    uploadLimiter,
    downloadLimiter
  } from './core/middleware/rate-limit.middleware.js';
import express, {
  type Request,
  type Response,
  type NextFunction
} from "express";
import cors from "cors";
import helmet from 'helmet';
import { corsConfig } from "./config/index.js";
import { getServerConfig } from "./config/index.js";
import { LoggerFactory } from "./core/factories/logger.factory.js";
import { AccessFactory } from "./core/factories/access.factory.js";
import { AccessService } from "./api/v1/services/access.service.js";
import { AccessController } from "./api/v1/controllers/access.controller.js";
import { createAccessRouter } from "./api/v1/routes/access.routes.js";
import { createHealthRouter } from "./api/v1/routes/health.routes.js";
import { StorageController } from "./api/v1/controllers/storage.controller.js";
import { createStoreRouter } from "./api/v1/routes/storeage.routes.js";
import { StorageFactory } from "./core/factories/storage.factory.js";
import { StorageService } from "./api/v1/services/store.service.js";

const logger = LoggerFactory.getLoggerProvider();

logger.trace("API: Initializing application...");

/**
 * Create and configure Express application
 * @returns Configured Express app
 */
  export function createApp() {
    const app = express();

    /**
     * NOTHING ABOVE THIS!  HELMET CONFIGURATION MUST COME FIRST!
     */
    app.use(helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],  // Allow inline styles if needed
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },

      // HTTP Strict Transport Security (HSTS)
      hsts: {
        maxAge: 31536000,        // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      },

      // Prevent MIME type sniffing
      noSniff: true,

      // XSS Protection (legacy browsers)
      xssFilter: true,

      // Hide X-Powered-By header
      hidePoweredBy: true,

      // Prevent clickjacking
      frameguard: {
        action: 'deny',
      },

      // Referrer Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    }));

    //comms configuration
    app.use(cors(corsConfig));
    app.use(express.json());
    app.set("trust proxy", true);

    //set up logging 
    app.use((req, _res, next) => {
      logger.trace(
        `\nIncoming ${req.method} request to ${
          req.path
        } with body ${JSON.stringify(req.body)}`
      );
      next();
    });

    // Apply stricter rate limiting to endpoints
    app.use('/api/v1/access/login', accessLimiter);
    app.use('/api/v1/storage/upload', uploadLimiter);
    app.use('/api/v1/storage/download', downloadLimiter);

    // Apply general API rate limiting to all API routes
    app.use('/api/v1', apiLimiter);


    // Using dependancy injection - add any future provider chains here (database, analytics, etc)
    const access = AccessFactory.getAccessProvider(logger);
    const accessService = new AccessService(logger, access);
    const accessController = new AccessController(logger, accessService);

    const storage = StorageFactory.getStorageProvider(logger);
    const storageService = new StorageService(logger, storage);
    const storageController = new StorageController(logger, storageService);

    // Root endpoint
    app.get("/", (req, res) => {
      logger.trace(`Root endpoint hit: ${req.method} ${req.path}`);
      res.send("Hello from Soleo API!");
    });

    // Health routes - note: these do not use /api/v1 prefix
    logger.info("App: Mounting /health routes...");
    const healthRoutes = createHealthRouter(logger);
    app.use("/health", healthRoutes);

    // API v1 access routes
    logger.info("App: Mounting /api/v1/access routes...");
    const accessRoutes = createAccessRouter(logger, accessController);
    app.use("/api/v1/access", accessRoutes);

    // API v1 storage routes
    const storageRoutes = createStoreRouter(logger, storageController);
    app.use("/api/v1/storage", storageRoutes);

    // fallback error handler if no route
    app.use((req, res) => {
      logger.warn(`404 - Route not found: ${req.method} ${req.path}`);
      res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path,
        method: req.method
      });
    });

     /**
     * NOTHING BELOW THIS!  GLOBAL ERROR HANDLER MUST COME LAST!
     */
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      // Log error with full details server-side
      logger.error('Global error handler caught error:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });

      // Send generic error to client (don't expose internal details)
      res.status(500).json({
        success: false,
        error: getServerConfig().deployment === 'PRODUCTION'
          ? 'An internal server error occurred'
          : err.message  // Only show details in development
      });
    });

    return app;
  }
import express, {
  type Request,
  type Response,
  type NextFunction
} from "express";
import cors from "cors";
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

    // =============================================================================
    // 1. COMMUNICATION CONFIGURATION
    // =============================================================================
    app.use(cors(corsConfig));
    app.use(express.json());
    app.set("trust proxy", true);

    // =============================================================================
    // 2. REQUEST LOGGING MIDDLEWARE (before routes)
    // =============================================================================
    app.use((req, _res, next) => {
      logger.trace(
        `\nIncoming ${req.method} request to ${
          req.path
        } with body ${JSON.stringify(req.body)}`
      );
      next();
    });

    // =============================================================================
    // 3. INITIALIZE DEPENDENCIES (before routes that use them)
    // =============================================================================
    const access = AccessFactory.getAccessProvider(logger);
    const accessService = new AccessService(logger, access);
    const accessController = new AccessController(logger, accessService);

    const storage = StorageFactory.getStorageProvider(logger);
    const storageService = new StorageService(logger, storage);
    const storageController = new StorageController(logger, storageService);

    // =============================================================================
    // 4. MOUNT ALL ROUTES
    // =============================================================================

    // Root endpoint
    app.get("/", (req, res) => {
      logger.trace(`Root endpoint hit: ${req.method} ${req.path}`);
      res.send("Hello from Soleo API!");
    });

    // Health routes - note: these do not use /api/v1 prefix
    logger.info("App: Mounting /health routes...");
    const healthRoutes = createHealthRouter(logger);
    app.use("/health", healthRoutes);

    // API v1 authentication routes
    logger.info("App: Mounting /api/v1/access routes...");
    const accessRoutes = createAccessRouter(logger, accessController);
    app.use("/api/v1/access", accessRoutes);

    // API v1 storage routes
    const storageRoutes = createStoreRouter(logger, storageController);
    app.use("/api/v1/storage", storageRoutes);

    // =============================================================================
    // 5. 404 HANDLER (after all routes, before error handler)
    // =============================================================================
    app.use((req, res) => {
      logger.warn(`404 - Route not found: ${req.method} ${req.path}`);
      res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path,
        method: req.method
      });
    });

    // =============================================================================
    // 6. GLOBAL ERROR HANDLER (MUST BE LAST)
    // =============================================================================
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
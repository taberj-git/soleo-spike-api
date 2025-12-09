import express, {
  type Request,
  type Response,
  type NextFunction
} from "express";
import cors from "cors";
import { corsConfig } from "./config/index.js";
import { LoggerFactory } from "./core/factories/logger.factory.js";
import { AuthFactory } from "./core/factories/access.factory.js";
import { AuthenticatorService } from "./api/v1/services/auth.service.js";
import { AuthenticatorController } from "./api/v1/controllers/auth.controller.js";
import { createAccessRouter } from "./api/v1/routes/access.routes.js";
import { createHealthRouter } from "./api/v1/routes/health.routes.js";

const logger = LoggerFactory.getLogger();

logger.trace("Soleo API: Initializing application...");

/**
 * Create and configure Express application
 * @returns Configured Express app
 */
export function createApp() {
  const app = express();

  // communication configuration
  app.use(cors(corsConfig));
  app.use(express.json());
  app.set("trust proxy", true);

  // Request logging middleware
  app.use((req, _res, next) => {
    logger.trace(
      `\nIncoming ${req.method} request to ${
        req.path
      } with body ${JSON.stringify(req.body)}`
    );
    next();
  });

  //global error handling response
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Caught the error:", err.message);
    res.status(500).json({ error: err.message });
  });

  // Initialize authentication components
  const authenticator = AuthFactory.getAuthenticator(logger);
  const authService = new AuthenticatorService(logger, authenticator);
  const authController = new AuthenticatorController(logger, authService);

  // Root endpoint
  app.get("/", (req, res) => {
    logger.trace(`Root endpoint hit: ${req.method} ${req.path}`);
    res.send("Hello from Soleo API!");
  });

  // Mount health routes - note: these do not use /api/v1
  logger.info("App: Mounting /api/v1/health routes...");
  const healthRoutes = createHealthRouter(logger);
  app.use("/health", healthRoutes);

  // Mount API v1 authentication routes
  logger.info("App: Mounting /api/v1/auth routes...");
  const authRoutes = createAccessRouter(logger, authController);
  app.use("/api/v1/auth", authRoutes);

  return app;
}

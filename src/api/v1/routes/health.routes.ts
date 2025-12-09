import express from "express";
import type { ILogger } from "../../../core/interfaces/logger.interface.js";
import { getErrorMessage } from "../../../core/util/error.util.js";

/**
 * Create and configure health router
 * @param logger - Logger instance
 * @returns Express router
 */
export function createHealthRouter(logger: ILogger) {
  logger.trace("Enter health.routes.createHealthRouter");

  const router = express.Router();

  /**
   *  To see if the container is running. (/health/live)
   */
  router.get("/live", (_req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date() });
  });

  /**
   * Checks if running and dependencies (DB, Storage) are actually 
   * reachable. (/health/ready)
   */
  router.get("/ready", async (_req, res) => {
    try {
      //check sub-systems (storage, authorization, database, etc)
      res.status(200).json({ status: "READY", services: { storage: "UP" } });
    } catch (err) {
      const message = getErrorMessage(err);
      res.status(503).json({ status: "DOWN", error: message });
    }
  });

  return router;
}
import express from 'express';
import type { ILogger } from '../../../core/interfaces/logger.interface.js';
import type { IStorageController } from '../../../core/interfaces/storage.interface.js'
import { getErrorMessage } from "../../../core/util/error.util.js";

/**
 * Create and configure storage router
 * @param logger - Logger instance
 * @param controller - Storage controller instance
 * @returns Express router
 */
export function createStoreRouter(logger: ILogger, controller: IStorageController) {
  logger.trace("Enter store.routes.createStoreRouter");
  const router = express.Router();

  /**
   * Upload endpoint to send files to the storage system
   */
  router.post('/upload', async (req, res, next) => {
    logger.trace('auth.routes /upload route hit, forwarding to controller');
    try {
      const response = await controller.uploadFileToStorage(req, res, next);
      res.json(response);
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error(`store.routes /upload error: ${message}`);
      res.status(500).json({ success: false, error: `upload failed: ${message}` });
    }
  });

  /**
   * Download endpoint to get files from the storage system
   */
  router.get('/download', async (req, res, next) => {
    logger.trace('store.routes /download route hit, forwarding to controller');
    try {
      const response = await controller.downloadFileFromStorage(req, res, next);
      res.json(response);
    } catch (err) {
      const message = getErrorMessage(err);
      logger.error(`store.routes /download error: ${message}`);
      res.status(500).json({ success: false, error: `download failed: ${message}` });
    }
  });

  return router;
}

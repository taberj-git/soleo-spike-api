import type { Request, Response, NextFunction } from "express";
import type {
  IStorageController,
  IStorageService,
} from "../../../core/interfaces/storage.interface.js";
import type { ILogger } from "../../../core/interfaces/logger.interface.js";
import { Readable } from "stream";
import { toError } from "../../../core/utilities/error.utility.js";
import { getServerConfig } from "../../../config/server.config.js";

/**
 * Authentication controller handling login/logout/etc requests.  Used by the router to
 * move requests to the service
 */
export class StorageController implements IStorageController {
  private storeService: IStorageService;
  private logger: ILogger;

  constructor(logger: ILogger, storeService: IStorageService) {
    this.storeService = storeService;
    this.logger = logger;
  }

  /**
   * upload file from client to the storage point
   * @param req
   * @param res
   * @param next
   */
  uploadFileToStorage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.trace(`enter StorageController.uploadFileToStorage`);

    if (!req.file) {
      //fast fail if no
      const err = new Error(String("No file uploaded"));
      next(err); //push to global error handler
      throw res.status(400).json({ error: "No file uploaded" });
    }

    const MAX_FILE_SIZE = getServerConfig().maxFileSize as number;
    if (req.file.size > MAX_FILE_SIZE) {
      const err = new Error("File size exceeds maximum allowed (100MB)");
      next(err);
      res.status(400).json({ error: "File too large" });
      return;
    }

    // Validate file type (whitelist)
    const ALLOWED_MIME_TYPES = [ //may need to put this in config?
      "image/jpeg",
      "image/png",
      "application/pdf",
      "text/plain",
    ];
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      const err = new Error("File type not allowed");
      next(err);
      res.status(400).json({ error: "Invalid file type" });
      return;
    }

    // Sanitize original filename
    const originalName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (originalName !== req.file.originalname) {
      this.logger.warn(
        `Filename sanitized from ${req.file.originalname} to ${originalName}`
      );
    }

    try {
      const filename = `${Date.now()}-${originalName}`;
      const fileStream = Readable.from(req.file?.buffer);

      await this.storeService.uploadFileToStorage(filename, fileStream, next);
      res.status(200);
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit StoreController.login caught an error:",
        err.message
      );
      next(err); //push to global error handler
    }
    this.logger.trace(`exit StorageController.uploadFileToStorage`);
  };

  /**
   * Handle file download from the filestore to the client
   * @param req - Express request object
   * @returns Promise<ILogoutResponse>
   */
  downloadFileFromStorage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.logger.trace(`enter StorageController.downloadFileFromStorage`);

    const filename = req.params["filename"];

    if (!filename) {
      //fast fail if no filename
      const err = new Error(String("No file requested"));
      this.logger.error(
        "Exit StorageController.downloadFileFromStorage caught an error:",
        err.message
      );
      next(err); //push to global error handler
      throw res.status(400).json({ error: "No file requested" });
    }

    // Validate filename format (alphanumeric, dash, underscore, dot only)
    if (!/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(filename)) {
      const err = new Error("Invalid filename format");
      next(err);
      res.status(400).json({ error: "Invalid filename" });
      return;
    }

    // Check for path traversal attempts
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      this.logger.warn(`Path traversal attempt detected: ${filename}`);
      const err = new Error("Invalid filename: path traversal detected");
      next(err);
      res.status(400).json({ error: "Invalid filename" });
      return;
    }

    // Validate filename length
    if (filename.length > 255) {
      const err = new Error("Filename too long");
      next(err);
      res.status(400).json({ error: "Filename too long" });
      return;
    }

    try {
      const fileStream = await this.storeService.downloadFileFromStorage(
        filename,
        next
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");
      fileStream.pipe(res);

      fileStream.on("error", (err) => {
        console.error("Stream error:", err);
        res.end(); // Close connection
        next(err);
      });
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error(
        "Exit StorageController.downloadFileFromStorage caught an error:",
        err.message
      );
      next(err); //push to global error handler
    }

    this.logger.trace(`exit StorageController.downloadFileFromStorage`);
  };
}

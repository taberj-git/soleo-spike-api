import type { NextFunction } from 'express';
import { Readable } from "stream";
import type {
  IStorage,
  IStorageService,
  IStorageUploadResult,
} from "../../../core/interfaces/storage.interface.js";
import type { ILogger } from "../../../core/interfaces/logger.interface.js";

import fs from 'fs';
import path from 'path';
import { getServerConfig } from '../../../config/index.js';
import { toError } from '../../../core/utilities/error.utility.js';

export class StorageService implements IStorageService {
  storage: IStorage;
  logger: ILogger;
  uploadDir: string = path.join(getServerConfig().localStoragePath, 'uploads');
 
  /**
   * Constructor
   * @param _logger - Logger instance
   * @param _authenticator - Authenticator instance (provider specific)
   */
  constructor(logger: ILogger, storage: IStorage) {
    this.storage = storage;
    this.logger = logger;
   
    // Ensure directory exists
    if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

   /**
     * Upload file to storage provider
     * 
     * Delegates file storage operation to the configured storage provider
     * (LocalStorage or AzureStorage) and returns metadata about the uploaded file.
     * 
     * @param filename - Target filename for storage (should include timestamp prefix from controller)
     * @param filestream - Readable stream containing file data to upload
     * @param next - Express NextFunction for error handling (architectural issue - should be removed)
     * @returns Promise resolving to upload result containing filename, path, size, timestamp, and optional hash
     * @throws {Error} If storage provider operation fails
     */
  async uploadFileToStorage(filename: string, filestream: Readable, next: NextFunction ): Promise<IStorageUploadResult> {
    this.logger.trace(`enter StorageService.uploadFileToStorage(${filename})`);
    
    //set up a dummy 
    let storageUploadResult: IStorageUploadResult = {
      filename:filename,
      path:this.uploadDir, 
      size:0,
      timestamp:new Date(),
    }

    try {
      storageUploadResult = (await this.storage.uploadFileToStorage(filename, filestream)) as IStorageUploadResult;
    } catch (error:unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error('StoreService.uploadFileToStorage caught an error:', err.message);
      next(err);  //push to global error handler
    }

    this.logger.trace(`exit StorageService.uploadFileToStorage(${filename})`);
    return storageUploadResult
  }

  /**
     * Download file from storage provider
     * 
     * Retrieves file from the configured storage provider and returns it as a
     * Readable stream for piping to the HTTP response.
     * 
     * @param filename - Name of file to retrieve from storage
     * @param next - Express NextFunction for error handling (architectural issue - should be removed)
     * @returns Promise resolving to Readable stream containing file data
     * @throws {Error} If file not found or storage provider operation fails
     */
  async downloadFileFromStorage(filename: string, next: NextFunction): Promise<Readable> {
    this.logger.trace(`enter StorageService.downloadFileFromStorage(${filename})`);

    let stream: Readable = new Readable();
    try {
      stream = (await this.storage.downloadFileFromStorage(filename)) as Readable;
    } catch (error:unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error('StoreService.downloadFileToStorage caught an error:', err.message);
      next(err);  //push to global error handler
    }

    this.logger.trace(`exit StorageService.downloadFileFromStorage()`);
    return stream;
  }
}
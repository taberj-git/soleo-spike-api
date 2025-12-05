import type { NextFunction } from 'express';
import { Readable } from "stream";
import type {
  IStorage,
  IStorageService,
  IStorageUploadResult,
} from "../../../core/interfaces/store.interface.js";
import type { ILogger } from "../../../core/interfaces/logger.interface.js";
import { toError } from "../../../core/util/error.util.js";
import fs from 'fs';
import path from 'path';
import { getServerConfig } from '../../../config/index.js';

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
   * 
   * @param filename 
   * @param filestream 
   * @param next 
   * @returns 
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
   * 
   * @param filename 
   * @param next 
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
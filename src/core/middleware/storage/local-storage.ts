// src/services/storage/LocalStorage.ts
import fs from "fs";
import path from "path";
import type { IStorage, IStorageUploadResult } from "../../interfaces/storage.interface.js";
import type { Readable } from "stream";
import type { ILogger } from "../../interfaces/logger.interface.js";
import { getServerConfig } from '../../../config/index.js';
import type { IntegrityMode } from "../../../config/integrity.types.js";
import { IntegrityStreamFactory } from "../../factories/integrity.factory.js";


/**
 * Implements the IStorage interface to use local storage.  This will default to
 * /tmp in linux and C:\Users\ContainerUser\AppData\Local\Temp in windows
 */
export class LocalStorage implements IStorage {
  private baseDir = getServerConfig().localStoragePath;
  private uploadDir = path.join(this.baseDir, "uploads");
  private logger: ILogger;
  
    constructor(_logger: ILogger) {
      this.logger = _logger;
      this.logger.info(`Base Directory for upload/get is ${this.baseDir}`)
    }

  /**
   *
   * @param filename
   * @param stream
   */
  async uploadFileToStorage(filename: string, stream: any): Promise<IStorageUploadResult> {
    this.logger.trace(`enter LocalStorage.uploadFile for ${filename}`)

    const INTEGRITY_MODE = getServerConfig().integrityMode as IntegrityMode;
    const filePath = path.join(this.uploadDir, filename);

    const { stream: monitorStream, getResult } = IntegrityStreamFactory.create(INTEGRITY_MODE);
    
    stream.pipe(monitorStream);
    const writeStream = fs.createWriteStream(path.join(this.uploadDir, filename));
    
    await new Promise<void>((resolve, reject) => {
        monitorStream.pipe(writeStream); // Monitor passes data to Disk
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });

    const metadata = await getResult();

    /*
    filename: string;
  path: string;
  size: number;
  timestamp: Date;
  hash?: string; // Optional
   
   
    */

    const result: IStorageUploadResult = {
      filename,
      path: filePath,
      size: metadata.size,
      timestamp: new Date(),
      hash: metadata.hash
    }
    this.logger.trace(`exitLocalStorage.uploadFile())`)
    
    return result;
  }

  /**
   *
   * @param filename
   * @returns Promise<Readable>
   */
  async downloadFileFromStorage(filename: string): Promise<Readable> {
    const fullPath = path.join(this.baseDir, filename);

    try {
      await fs.promises.access(fullPath, fs.constants.R_OK);
      return fs.createReadStream(fullPath);
    } catch (error) {
      throw new Error(`File not found or not readable: ${filename}`);
    }
  }
}



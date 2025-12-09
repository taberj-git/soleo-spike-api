import type { ILogger } from "../../interfaces/logger.interface.js";
import type { IStorage, IStorageUploadResult } from "../../interfaces/storage.interface.js";
import type { Readable } from "stream";
import { getCloudStorageConfig } from '../../../config/store.config.js'

/**
 * Azure Specific implementation 
 */
export class AzureStorage implements IStorage {
  private logger: ILogger;
  private accountName: string;
  private accountKey: string;
  private containerName: string;
  private connectionString: string;

  
  /**
   * 
   * @param _logger 
   */
  constructor(_logger: ILogger) {
    this.logger = _logger;
    this.accountName = getCloudStorageConfig().accountName;
    this.accountKey = getCloudStorageConfig().accountKey;
    this.containerName = getCloudStorageConfig().containerName;
    this.connectionString = getCloudStorageConfig().connectionString;
    this.logger.info(`AzureStorage instantiated with accountName:${this.accountName} accountKey:${this.accountKey} containerName:${this.containerName} connectionString:${this.connectionString}`); 
  }

  /**
   * Send file to the Azure storage endpoint
   * @param filename
   * @param stream
   * @return Promise<IStorageUploadResult>
   */
  async uploadFileToStorage(filename: string, _stream: any): Promise<IStorageUploadResult> {
    this.logger.trace(`enter AzureStorage.uploadFile(${filename})`)
    throw new Error("AzureStorage.uploadFile not implemented yet");
  }

  /**
   * Download a file from the Azure storage endpoint
   * @param filename
   * @returns Promise<Readable>
   */
  async downloadFileFromStorage(_filename: string): Promise<Readable> {
    this.logger.trace(`enter AzureStorage.getFile(${_filename})`)
    throw new Error("AzureStorage.getFile not implemented yet");
  }
}

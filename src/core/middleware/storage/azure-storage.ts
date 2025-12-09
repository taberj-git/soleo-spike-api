import type { ILogger } from "../../interfaces/logger.interface.js";
import type { IStorage, IStorageUploadResult } from "../../interfaces/storage.interface.js";
import type { Readable } from "stream";

/**
 * TODO: use config file to get connection specifications for up/down loading files
 */
export class AzureStorage implements IStorage {
  private logger: ILogger;


  
  constructor(_logger: ILogger) {
    this.logger = _logger;
  }

  /**
   *
   * @param filename
   * @param stream
   */
  async uploadFileToStorage(filename: string, _stream: any): Promise<IStorageUploadResult> {
    this.logger.trace(`enter AzureStorage.uploadFile(${filename})`)
    throw new Error("AzureStorage.uploadFile not implemented yet");
  }

  /**
   *
   * @param filename
   * @returns Promise<Readable>
   */
  async downloadFileFromStorage(_filename: string): Promise<Readable> {
    this.logger.trace(`enter AzureStorage.getFile(${_filename})`)
    throw new Error("AzureStorage.getFile not implemented yet");
  }
}

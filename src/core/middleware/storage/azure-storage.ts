import type { ILogger } from "../../interfaces/logger.interface.js";
import type {
  IStorage,
  IStorageUploadResult,
} from "../../interfaces/storage.interface.js";
import type { Readable } from "stream";
import { getCloudStorageConfig } from "../../../config/store.config.js";

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
    this.logger.info(
      `AzureStorage instantiated with accountName:${this.accountName} accountKey:${this.accountKey} containerName:${this.containerName} connectionString:${this.connectionString}`
    );
  }

  /**
   * Upload file to Azure Blob Storage
   *
   * NOTE: This is currently a stub implementation that throws an error.
   * Real implementation should use @azure/storage-blob SDK to upload
   * the stream to Azure Blob Storage container.
   *
   * @param filename - Target blob name in Azure Storage container
   * @param _stream - Readable stream containing file data (unused in stub)
   * @returns Promise resolving to upload result with Azure blob metadata
   * @throws {Error} Always throws "not implemented yet" error
   * @example
   * // Real implementation should look like:
   * const blockBlobClient = containerClient.getBlockBlobClient(filename);
   * await blockBlobClient.uploadStream(stream);
   * return { filename, path: blockBlobClient.url, size, timestamp: new Date() };
   */
  async uploadFileToStorage(
    filename: string,
    _stream: any
  ): Promise<IStorageUploadResult> {
    this.logger.trace(`enter AzureStorage.uploadFile(${filename})`);
    throw new Error("AzureStorage.uploadFile not implemented yet");
  }

 /**
     * Download file from Azure Blob Storage
     * 
     * NOTE: This is currently a stub implementation that throws an error.
     * Real implementation should use @azure/storage-blob SDK to download
     * the blob as a readable stream.
     * 
     * @param _filename - Blob name to download from Azure Storage container (unused in stub)
     * @returns Promise resolving to Readable stream of blob contents
     * @throws {Error} Always throws "not implemented yet" error
     * @example
     * // Real implementation should look like:
     * const blockBlobClient = containerClient.getBlockBlobClient(filename);
     * const downloadResponse = await blockBlobClient.download();
     * return downloadResponse.readableStreamBody;
     */
  async downloadFileFromStorage(_filename: string): Promise<Readable> {
    this.logger.trace(`enter AzureStorage.getFile(${_filename})`);
    throw new Error("AzureStorage.getFile not implemented yet");
  }
}

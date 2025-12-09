import type { IStorage } from "../interfaces/storage.interface.js";
import { LocalStorage } from "../middleware/storage/local-storage.js";
import { AzureStorage } from "../middleware/storage/azure-storage.js";
import type { ILogger } from "../interfaces/logger.interface.js";
import { getServerConfig } from "../../config/index.js";

export class StorageFactory {
  static getStorageProvider(logger: ILogger): IStorage {
    logger.trace(`enter StorageFactory.getStorageProvider()`);
    const provider = getServerConfig().storageProvider;

    switch (provider.toUpperCase()) {
      case "AZURE":
        return new AzureStorage(logger);
        throw new Error("Azure not implemented yet");
      case "LOCAL":
      default:
        console.log("Using Local Storage");
        return new LocalStorage(logger);
    }

    logger.trace(`exit StorageFactory.getStorageProvider()`);
  }
}

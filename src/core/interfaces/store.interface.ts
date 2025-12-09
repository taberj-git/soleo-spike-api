/**
 * Contains all the interfaces for the storage chain:
 *    Service
 *    Controller
 *    Provider specific storage
 * The interfaces allow dependancy injection for testing using mocks, etc.
 * TODO: revisit with architecture to determine if they are all required and if any
 * should move from core to api/v1.
 */
import type { NextFunction, Request, Response } from "express";
import { Readable } from "stream";

export interface IStorageUploadResult {
  filename: string;
  path: string;
  size: number;
  timestamp: Date;
  hash?: string | undefined; // Optional
}

/**
 *
 * Connects the storage router with the storage service
 */
export interface IStorageController {
  /**
   * Send a file to the storage endpoint
   *
   * @param req
   * @param res
   * @param next
   */
  uploadFileToStorage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  /**
   * Retrieve a file from the storage endpoint
   *
   * @param req
   * @param res
   * @param next
   */
  downloadFileFromStorage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

/**
 * connects the router/controller chain to the provider specific implementation for storage
 */
export interface IStorageService {
  /**
   * Send a file to the storage endpoint
   * TODO: same as controller
   *
   * @param filename
   * @param stream
   */
  uploadFileToStorage(filename: string, stream: Readable, next: NextFunction): Promise<IStorageUploadResult>;

  /**
   * Get a file from the storage point
   * @param filename
   * @returns Promise<Readable>
   */
  downloadFileFromStorage(filename: string, next: NextFunction): Promise<Readable>;
}

/**
 * Will be implemented by provider-specific implmentation
 */
export interface IStorage {
  /**
   * Send a file to the storage endpoint
   * @param filename
   * @param stream
   *
   */
  uploadFileToStorage(filename: string, stream: Readable): Promise<IStorageUploadResult>;

  /**
   * Get a file from the storage point
   * @param filename
   * @returns Promise<Readable>
   */
  downloadFileFromStorage(filename: string): Promise<Readable>;
}

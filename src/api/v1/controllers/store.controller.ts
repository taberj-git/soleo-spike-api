import type { Request, Response, NextFunction } from 'express';
import type {
  IStorageController,
  IStorageService
} from '../../../core/interfaces/store.interface.js';
import type { ILogger } from '../../../core/interfaces/logger.interface.js';
import { toError } from '../../../core/util/error.util.js';
import { Readable } from 'stream';

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
  * 
  * @param req 
  * @param res 
  * @param next 
  */
  uploadFileToStorage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.trace(`enter StorageController.uploadFileToStorage`);

    if (!req.file) { //fast fail if no 
      const err = new Error(String('No file uploaded'));
      next(err);  //push to global error handler
      throw res.status(400).json({ error: 'No file uploaded' });
    }

    //TODO may need to add cyber security checks, etc before passing to service
    //TODO does using dedicated objects for json back from service/provider make sense?
    try {
      const originalName = req.file.originalname;
      const filename = `${Date.now()}-${originalName}`;
      const fileStream = Readable.from(req.file?.buffer);
      await this.storeService.uploadFileToStorage(filename, fileStream, next)
      res.status(200);
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error('Exit AuthController.login caught an error:', err.message);
      next(err);  //push to global error handler
    }
    this.logger.trace(`exit StorageController.uploadFileToStorage`);
  };

  /**
   * Handle logout endpoint
   * @param req - Express request object
   * @returns Promise<ILogoutResponse>
   */
  downloadFileFromStorage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.trace(`enter StorageController.downloadFileFromStorage`);

    const filename = req.params['filename'];
    //TODO: may need to check the name for cybersecurity
    if (!filename) { //fast fail if no filename
      const err = new Error(String('No file requested'));
      next(err);  //push to global error handler
      throw res.status(400).json({ error: 'No file requested' });
    }

    try {
      const fileStream = await this.storeService.downloadFileFromStorage(filename, next)
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      fileStream.pipe(res);

      fileStream.on('error', (err) => {
          console.error('Stream error:', err);
          res.end(); // Close connection
          next(err);
      });
    } catch (error: unknown) {
      const err = toError(error); //convert to Error object
      this.logger.error('Exit StorageController.downloadFileFromStorage caught an error:', err.message);
      next(err);  //push to global error handler
    }  

    this.logger.trace(`exit StorageController.downloadFileFromStorage`);
  };
}

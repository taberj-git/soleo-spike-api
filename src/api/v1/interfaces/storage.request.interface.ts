export interface IFileUploadRequest {
    file: Express.Multer.File;
    metadata?: {
      description?: string;
      tags?: string[];
      category?: string;
    };
  }

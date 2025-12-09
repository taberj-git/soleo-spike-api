export interface CloudStorageConfig {
    accountName: string;
    accountKey: string;
    containerName: string;
    connectionString: string;
  }

  export function getCloudStorageConfig(): CloudStorageConfig {
    const accountName = process.env['STORAGE_ACCOUNT_NAME'];
    const accountKey = process.env['STORAGE_ACCOUNT_KEY'];
    const containerName = process.env['STORAGE_CONTAINER_NAME'] || 'uploads';

    if (!accountName || !accountKey) {
      throw new Error('Storage credentials not configured');
    }

    //TODO may need to make this more generic to support S3, Azure, GC
    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;

    return {
      accountName,
      accountKey,
      containerName,
      connectionString
    };
  }
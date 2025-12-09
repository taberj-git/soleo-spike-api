import fs from 'fs';
import * as os from 'os';
import path from 'path';
import type { IntegrityMode } from './integrity.types.js';


/**
 * Server configuration for HTTP/HTTPS setup
 */
export interface ServerConfig {
  port: number;
  useHttps: boolean;
  httpsOptions?: {
    key: Buffer;
    cert: Buffer;
  };
  localStoragePath: string;
  storageProvider: string;
  integrityMode: IntegrityMode;
  maxFileSize: Number;
  accessProvider: string;
  deployment: string;
}

/**
 * Get server configuration based on environment variables
 * @returns Server configuration object
 */
export function getServerConfig(): ServerConfig {
  const PORT = Number(process.env['PORT']) || 3000;
  const USE_HTTPS = process.env['USE_HTTPS'] === 'true';
  const LOCAL_STORAGE_PATH = process.env['LOCAL_STORAGE_PATH'] || os.tmpdir();
  const STORAGE_PROVIDER = process.env['STORAGE_PROVIDER'] || 'LOCAL'
  const INTEGRITY_MODE = (process.env['INTEGRITY_CHECK'] || 'SIZE') as IntegrityMode;
  const MAX_FILE_SIZE = (process.env['MAX_FILE_SIZE'] || 104857600) as number; //100MB
  const ACCESS_PROVIDER = process.env['ACCESS_PROVIDER'] || 'AZURE';
  const DEPLOYMENT = process.env['DEPLOYMENT'] || 'TEST';

  const config: ServerConfig = {
    port: PORT,
    useHttps: USE_HTTPS,
    localStoragePath: LOCAL_STORAGE_PATH,
    storageProvider: STORAGE_PROVIDER,
    integrityMode: INTEGRITY_MODE,
    maxFileSize: MAX_FILE_SIZE,
    accessProvider: ACCESS_PROVIDER,
    deployment: DEPLOYMENT
  };

  // Load HTTPS certificates if HTTPS is enabled
  if (USE_HTTPS) {
    const certPath = process.env['SSL_CERT_PATH'] || './certs/server.cert';
    const keyPath = process.env['SSL_KEY_PATH'] || './certs/server.key';

    try {
      config.httpsOptions = {
        key: fs.readFileSync(path.resolve(keyPath)),
        cert: fs.readFileSync(path.resolve(certPath)),
      };
    } catch (error) {
      throw new Error(
        `Failed to load SSL certificates. Ensure files exist at:\n` +
          `  Key:  ${path.resolve(keyPath)}\n` +
          `  Cert: ${path.resolve(certPath)}\n` +
          `Error: ${error}`
      );
    }
  }

  return config;
}

import fs from 'fs';
import path from 'path';

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
}

/**
 * Get server configuration based on environment variables
 * @returns Server configuration object
 */
export function getServerConfig(): ServerConfig {
  const port = Number(process.env['PORT']) || 3000;
  const useHttps = process.env['USE_HTTPS'] === 'true';

  const config: ServerConfig = {
    port,
    useHttps,
  };

  // Load HTTPS certificates if HTTPS is enabled
  if (useHttps) {
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

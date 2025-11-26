import http from 'http';
import https from 'https';
import { createApp } from './app.js';
import { LoggerFactory } from './core/factories/logger.factory.js';
import { getServerConfig } from './config/server.config.js';

const logger = LoggerFactory.getLogger();
const app = createApp();
const config = getServerConfig();

/**
 * Start the HTTP or HTTPS server based on configuration
 */
const server = config.useHttps
  ? https.createServer(config.httpsOptions!, app)
  : http.createServer(app);

server.listen(config.port, () => {
  const protocol = config.useHttps ? 'https' : 'http';
  logger.info(`\n✓ Server running on ${protocol}://localhost:${config.port}`);
  logger.info(`  Mode: ${config.useHttps ? 'HTTPS (Production/Testing)' : 'HTTP (Development)'}`);
  logger.info('Available endpoints:');
  logger.info('  GET  /');
  logger.info('  POST /api/v1/auth/login');
  logger.info('  POST /api/v1/auth/logout');
  logger.info('  POST /api/v1/auth/authorize\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing server');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('\nSIGINT signal received: closing server');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

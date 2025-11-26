import type { CorsOptions } from 'cors';

/**
 * CORS configuration for the API
 */
export const corsConfig: CorsOptions = {
  origin: process.env['CORS_ALLOWED_ORIGINS']
    ? process.env['CORS_ALLOWED_ORIGINS'].split(',')
    : ['http://localhost:5173'],
  methods: 'GET, POST',
  credentials: true,
  optionsSuccessStatus: 204,
};

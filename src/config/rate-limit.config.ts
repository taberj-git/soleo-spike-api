export const rateLimitConfig = {
    access: {
      windowMs: parseInt(process.env['AUTH_RATE_LIMIT_WINDOW'] || '900000'),  // 15 min
      max: parseInt(process.env['AUTH_RATE_LIMIT_MAX'] || '5'),
    },
    api: {
      windowMs: parseInt(process.env['API_RATE_LIMIT_WINDOW'] || '900000'),  // 15 min
      max: parseInt(process.env['API_RATE_LIMIT_MAX'] || '100'),
    },
    upload: {
      windowMs: parseInt(process.env['UPLOAD_RATE_LIMIT_WINDOW'] || '3600000'),  // 1 hour
      max: parseInt(process.env['UPLOAD_RATE_LIMIT_MAX'] || '10'),
    },
    download: {
      windowMs: parseInt(process.env['DOWNLOAD_RATE_LIMIT_WINDOW'] || '900000'),  // 15 min
      max: parseInt(process.env['DOWNLOAD_RATE_LIMIT_MAX'] || '50'),
    },
  };

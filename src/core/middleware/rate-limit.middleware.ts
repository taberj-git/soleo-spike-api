import rateLimit from "express-rate-limit";

/**
 * Strict rate limiting for authentication endpoints
 * Prevents brute force attacks on login
 */
export const accessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests
  skipFailedRequests: false, // Count failed requests
});

/**
 * General API rate limiting
 * Prevents DoS attacks on API endpoints
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File upload rate limiting (more restrictive)
 * Prevents abuse of file storage
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    success: false,
    error: "Upload limit exceeded, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Download rate limiting
 * Prevents bandwidth abuse
 */
export const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 downloads per window
  message: {
    success: false,
    error: "Download limit exceeded, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

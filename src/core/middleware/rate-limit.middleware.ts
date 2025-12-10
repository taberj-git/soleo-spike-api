import rateLimit from "express-rate-limit";
import { rateLimitConfig } from "../../config/index.js";

/**
 * Strict rate limiting for authentication endpoints
 * Prevents brute force attacks on login
 */
export const accessLimiter = rateLimit({
  windowMs: rateLimitConfig.access.windowMs,
  max: rateLimitConfig.access.max,
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
  windowMs: rateLimitConfig.api.windowMs,
  max: rateLimitConfig.api.max,
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
  windowMs: rateLimitConfig.upload.windowMs,
  max: rateLimitConfig.upload.max,
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
 windowMs: rateLimitConfig.download.windowMs,
  max: rateLimitConfig.download.max,
  message: {
    success: false,
    error: "Download limit exceeded, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

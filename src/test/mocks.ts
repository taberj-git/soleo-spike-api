import type { Request, Response, NextFunction } from 'express';
import type { ILogger } from '../core/interfaces/logger.interface.js';
import { jest } from '@jest/globals';

/**
 * Create a mock Express Request object
 */
export function mockRequest(overrides: Partial<Request> = {}): Partial<Request> {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    method: 'GET',
    path: '/',
    ...overrides,
  } as Partial<Request>;
}

/**
 * Create a mock Express Response object
 */
export function mockResponse(): Partial<Response> {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
}

/**
 * Create a mock Express NextFunction
 */
export function mockNext(): NextFunction {
  return jest.fn();
}

/**
 * Create a mock Logger
 */
export function mockLogger(): jest.Mocked<ILogger> {
  return {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  };
}
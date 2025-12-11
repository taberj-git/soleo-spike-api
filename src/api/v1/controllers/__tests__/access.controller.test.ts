import { jest } from '@jest/globals';
import { AccessController } from "../access.controller.js";
import {
  mockRequest,
  mockResponse,
  mockNext,
  mockLogger,
} from "../../../../test/mocks.js";
import type { IAccessService } from "../../../../core/interfaces/access.interface.js";
import type { Request, Response } from "express";

describe("AccessController", () => {
  let controller: AccessController;
  let mockService: jest.Mocked<IAccessService>;
  let logger: ReturnType<typeof mockLogger>;

  beforeEach(() => {
    logger = mockLogger();

    mockService = {
      login: jest.fn(),
      logout: jest.fn(),
      authenticate: jest.fn(),
    } as any;

    controller = new AccessController(logger, mockService);
  });

  describe("login", () => {
    it("should reject username shorter than 3 characters", async () => {
      const req = mockRequest({
        body: { username: "ab", password: "TestPass123" },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await controller.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid username format",
      });
    });

    it("should reject username longer than 50 characters", async () => {
      const req = mockRequest({
        body: {
          username: "a".repeat(51),
          password: "TestPass123",
        },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await controller.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid username format",
      });
    });

    it("should reject username with invalid characters", async () => {
      const req = mockRequest({
        body: { username: "user@invalid", password: "TestPass123" },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await controller.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Username contains invalid characters",
      });
    });

    it("should reject password shorter than 8 characters", async () => {
      const req = mockRequest({
        body: { username: "testuser", password: "Test12" },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      await controller.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid password format",
      });
    });

    it("should accept valid credentials and return token", async () => {
      const req = mockRequest({
        body: { username: "validuser", password: "ValidPass123" },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      mockService.login.mockResolvedValue({
        success: true,
        token: "mock-jwt-token",
        userId: "12345",
        userType: "patient",
      });

      await controller.login(req, res, next);

      expect(mockService.login).toHaveBeenCalledWith(
        "validuser",
        "ValidPass123"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: "mock-jwt-token",
        userId: "12345",
        userType: "patient",
      });
    });
  });

  describe("logout", () => {
    it("should accept logout even without user-id header (mock accepts all)", async () => {
      const req = mockRequest({
        headers: {},
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      mockService.logout.mockResolvedValue({
        success: true,
        userId: undefined,
      });

      await controller.logout(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        userId: undefined,
      });
    });

    it("should successfully logout with valid user-id", async () => {
      const req = mockRequest({
        headers: { "user-id": "12345" },
      }) as Request;
      const res = mockResponse() as Response;
      const next = mockNext();

      mockService.logout.mockResolvedValue({
        success: true,
        userId: "12345",
      });

      await controller.logout(req, res, next);

      expect(mockService.logout).toHaveBeenCalledWith("12345");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        userId: "12345",
      });
    });
  });
});

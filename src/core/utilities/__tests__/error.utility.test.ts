import { toError, getErrorMessage } from "../error.utility.js";

describe("Error Utilities", () => {
  describe("toError", () => {
    it("should return Error as-is", () => {
      const error = new Error("Test error");
      expect(toError(error)).toBe(error);
    });

    it("should convert string to Error", () => {
      const result = toError("String error");
      expect(result).toBeInstanceOf(Error);
      // flatted.stringify wraps strings in array notation
      expect(result.message).toContain("String error");
    });

    it("should convert object to Error", () => {
      const obj = { message: "Object error", code: 500 };
      const result = toError(obj);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toContain("Object error");
    });

    it("should handle null/undefined", () => {
      expect(toError(null)).toBeInstanceOf(Error);
      expect(toError(undefined)).toBeInstanceOf(Error);
    });
  });

  describe("getErrorMessage", () => {
    it("should extract message from Error", () => {
      const error = new Error("Test message");
      expect(getErrorMessage(error)).toBe("Test message");
    });

    it("should convert non-Error to string", () => {
      // flatted.stringify wraps primitives in array notation
      expect(getErrorMessage("String error")).toContain("String error");
      expect(getErrorMessage(123)).toContain("123");
    });
  });
});

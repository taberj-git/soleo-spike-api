import { stringify } from "flatted";

/**
 * reliably converts a thrown value into an Error object
 */
export function toError(maybeError: unknown): Error {
  //short circuit return if it is an error
  if (maybeError instanceof Error) {
    return maybeError;
  }

  //create and return an error object
  try {
    return new Error(stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

/**
 * Extract just the message string (good for HTTP responses)
 */
export function getErrorMessage(maybeError: unknown): string {
  return toError(maybeError).message;
}

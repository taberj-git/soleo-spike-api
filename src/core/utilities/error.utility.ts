import { stringify } from 'flatted';  //circular json will fail if using JSON.stringify

/**
 * reliably converts a thrown value into an Error object
 */
export function toError(maybeError: unknown): Error {
  if (maybeError instanceof Error) {
    return maybeError;
  }

  try {
    return new Error(stringify(maybeError));
  } catch {
    // fallback in case stringify fails (circular references)
    return new Error(String(maybeError));
  }
}

/**
 * Extract just the message string (good for HTTP responses)
 */
export function getErrorMessage(maybeError: unknown): string {
  return toError(maybeError).message;
}
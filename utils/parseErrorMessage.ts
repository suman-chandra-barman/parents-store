/**
 * Safely parses and extracts an error message from a backend API error response (e.g., RTK Query)
 * or a standard JavaScript/TypeScript Error instance.
 *
 * @param error The caught error (typically of type 'unknown')
 * @param fallbackMsg Optional default message to return if no message is found
 */
export function parseErrorMessage(
  error: unknown,
  fallbackMsg: string = "Something went wrong"
): string {
  if (error && typeof error === "object") {
    const apiError = error as { data?: { message?: string }; message?: string };
    return apiError?.data?.message || apiError?.message || fallbackMsg;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallbackMsg;
}

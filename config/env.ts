/**
 * Centralized Environment Configuration
 */
export const env = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
  mediaBaseUrl: process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "",
} as const;

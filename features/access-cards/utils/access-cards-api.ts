import { env } from "@/config/env";
import { AccessCardsResponse } from "../types/access-cards";

const blobCache = new Map<string, string>();
const fetchPromisesCache = new Map<string, Promise<string>>();

/**
 * Fetch Access Cards gallery data using Next.js / native fetch API.
 * @param password The access card password
 */
export async function fetchAccessCardsGallery(
  password: string
): Promise<AccessCardsResponse> {
  const cleanPassword = password.trim();
  const url = `${env.baseUrl}/photo-galleries/access-cards?passwords=${encodeURIComponent(cleanPassword)}`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    if (
      response.status === 401 ||
      response.status === 403 ||
      response.status === 404
    ) {
      throw new Error(
        "Invalid password or access card not found. Please try again."
      );
    }

    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(
      errorData?.message ||
        `Failed to fetch gallery photos (${response.status})`
    );
  }

  const data: AccessCardsResponse = await response.json();
  if (data && data.success === false) {
    throw new Error(data.message || "Failed to retrieve access card photos.");
  }

  return data;
}

/**
 * Fetch photo preview blob and return an Object URL string.
 * Caches results to prevent duplicate HTTP requests.
 */
export async function fetchPhotoPreviewBlob(photoId: string): Promise<string> {
  if (blobCache.has(photoId)) {
    return blobCache.get(photoId)!;
  }

  if (fetchPromisesCache.has(photoId)) {
    return fetchPromisesCache.get(photoId)!;
  }

  const fetchPromise = (async () => {
    try {
      const endpoint = `${env.mediaBaseUrl}/watermark-engine/preview-album-photos/${photoId}`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "image/*",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch photo preview: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      blobCache.set(photoId, objectUrl);
      return objectUrl;
    } catch (error) {
      fetchPromisesCache.delete(photoId);
      throw error;
    }
  })();

  fetchPromisesCache.set(photoId, fetchPromise);
  return fetchPromise;
}

/**
 * Get direct preview URL or cached blob URL for a photo
 */
export function getPhotoDirectUrl(photoId: string): string {
  if (blobCache.has(photoId)) {
    return blobCache.get(photoId)!;
  }
  return `${env.mediaBaseUrl}/watermark-engine/preview-album-photos/${photoId}`;
}

/**
 * Clear cached blob URLs if memory cleanup is needed
 */
export function clearBlobCache() {
  blobCache.forEach((url) => URL.revokeObjectURL(url));
  blobCache.clear();
  fetchPromisesCache.clear();
}


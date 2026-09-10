import { env } from "@/config/env";
import { AccessCardsResponse } from "../types/access-cards";

const blobCache = new Map<string, string>();
const fetchPromisesCache = new Map<string, Promise<string>>();

/**
 * Fetch Access Cards gallery data using native fetch API.
 * @param password The access card password
 */
export async function fetchAccessCardsGallery(
  password: string
): Promise<AccessCardsResponse> {
  const cleanPassword = password.trim();

  try {
    const url = new URL("/photo-galleries/access-cards", env.baseUrl);
    url.searchParams.set("passwords", cleanPassword);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        throw new Error("Invalid password or access card not found. Please try again.");
      }
      throw new Error(`Failed to fetch gallery photos (${response.status})`);
    }

    const data: AccessCardsResponse = await response.json();
    if (data && data.success === false) {
      throw new Error(data.message || "Failed to retrieve access card photos.");
    }

    return data;
  } catch (error: unknown) {
    throw error;
  }
}

/**
 * Fetch photo preview blob and return an Object URL string using native fetch (response.blob()).
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
        headers: {
          Accept: "image/*",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch photo preview (${response.status} ${response.statusText})`
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

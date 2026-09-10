import axios from "axios";
import { env } from "@/config/env";
import { apiClient } from "@/lib/axios";
import { AccessCardsResponse } from "../types/access-cards";

const blobCache = new Map<string, string>();
const fetchPromisesCache = new Map<string, Promise<string>>();

/**
 * Fetch Access Cards gallery data using axios.
 * @param password The access card password
 */
export async function fetchAccessCardsGallery(
  password: string
): Promise<AccessCardsResponse> {
  const cleanPassword = password.trim();

  try {
    const response = await apiClient.get<AccessCardsResponse>(
      `/photo-galleries/access-cards`,
      {
        params: {
          passwords: cleanPassword,
        },
      }
    );

    const data = response.data;
    if (data && data.success === false) {
      throw new Error(data.message || "Failed to retrieve access card photos.");
    }

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403 ||
        error.response?.status === 404
      ) {
        throw new Error(
          "Invalid password or access card not found. Please try again."
        );
      }
      const errorData = error.response?.data as { message?: string } | undefined;
      throw new Error(
        errorData?.message ||
          `Failed to fetch gallery photos (${error.response?.status || "network error"})`
      );
    }
    throw error;
  }
}

/**
 * Fetch photo preview blob and return an Object URL string using axios (responseType: 'blob').
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
      const response = await axios.get(endpoint, {
        responseType: "blob",
        headers: {
          Accept: "image/*",
        },
      });

      const blob = response.data as Blob;
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

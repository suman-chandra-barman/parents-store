"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useGetGalleryPasswordStatusQuery,
  useGetClassicGalleryQuery,
} from "../api/publicGalleriesApi";
import { useTenantStore } from "@/stores/useTenantStore";
import { PhotoItem } from "../types/public-galleries";
import { parseErrorMessage } from "@/utils/parseErrorMessage";

const getStorageKey = (jobId: string) => `classic_gallery_pw_${jobId.trim()}`;

export function usePublicGallery(jobIdOverride?: string) {
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get("jobId") || "";
  const jobId = (jobIdOverride || urlJobId).trim();

  const tenant = useTenantStore((state) => state.tenant);
  const isTenantLoading = useTenantStore((state) => state.isLoading);

  const [password, setPassword] = useState<string>(() => {
    if (typeof window !== "undefined" && jobId) {
      return sessionStorage.getItem(getStorageKey(jobId)) || "";
    }
    return "";
  });

  // Keep password state synchronized if jobId changes
  useEffect(() => {
    if (typeof window !== "undefined" && jobId) {
      const saved = sessionStorage.getItem(getStorageKey(jobId)) || "";
      setPassword(saved);
    }
  }, [jobId]);

  // 1. Check if password is required for this jobId
  const {
    data: passwordStatusResponse,
    isLoading: isStatusLoading,
    isFetching: isStatusFetching,
    error: statusError,
  } = useGetGalleryPasswordStatusQuery(jobId, {
    skip: !jobId || !tenant?.id,
  });

  const isPasswordRequired =
    passwordStatusResponse?.data?.isPasswordRequired ?? null;

  // Determine whether to execute the gallery fetch
  const shouldSkipGalleryQuery =
    !jobId ||
    !tenant?.id ||
    isPasswordRequired === null ||
    (isPasswordRequired === true && !password.trim());

  // 2. Fetch gallery photos
  const {
    data: galleryResponse,
    isLoading: isGalleryLoading,
    isFetching: isGalleryFetching,
    error: galleryError,
    refetch: refetchGallery,
  } = useGetClassicGalleryQuery(
    { jobId, password: password.trim() ? password.trim() : undefined },
    {
      skip: shouldSkipGalleryQuery,
    },
  );

  // Flatten photos from all albums
  const albums = useMemo(
    () => galleryResponse?.data?.albums || [],
    [galleryResponse],
  );

  const photos = useMemo(() => {
    const list: PhotoItem[] = [];
    albums.forEach((album) => {
      album.photos?.forEach((photo) => {
        list.push({
          id: photo.id,
          rotationAngle: photo.rotationAngle,
          albumId: album.id,
          album: {
            name: album.name,
            individualPriceListId: album.individualPriceListId || undefined,
            groupPriceListId: album.groupPriceListId || undefined,
          },
        });
      });
    });
    return list;
  }, [albums]);

  const submitPassword = useCallback(
    (enteredPassword: string) => {
      const clean = enteredPassword.trim();
      setPassword(clean);
      if (typeof window !== "undefined" && jobId) {
        sessionStorage.setItem(getStorageKey(jobId), clean);
      }
    },
    [jobId],
  );

  const resetPassword = useCallback(() => {
    setPassword("");
    if (typeof window !== "undefined" && jobId) {
      sessionStorage.removeItem(getStorageKey(jobId));
    }
  }, [jobId]);

  const rawError = galleryError || statusError;
  const errorMessage = rawError
    ? parseErrorMessage(
        rawError,
        "Failed to load gallery photos. Please check your password or connection.",
      )
    : null;

  const isCheckingPasswordStatus =
    (!tenant?.id && isTenantLoading) || isStatusLoading || isStatusFetching;

  const isLoadingGallery = isGalleryLoading || isGalleryFetching;

  const isPasswordVerified = Boolean(
    galleryResponse?.data && galleryResponse?.success,
  );

  return {
    jobId,
    password,
    isPasswordRequired,
    isCheckingPasswordStatus,
    isLoading: isCheckingPasswordStatus || isLoadingGallery,
    isGalleryLoading: isLoadingGallery,
    isPasswordVerified,
    photos,
    albums,
    totalCount: photos.length,
    error: errorMessage,
    galleryResponse,
    submitPassword,
    resetPassword,
    refetch: refetchGallery,
  };
}

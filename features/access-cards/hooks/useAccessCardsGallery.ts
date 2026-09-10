"use client";

import { useState, useCallback } from "react";
import { useGetAccessCardsGalleryQuery } from "../api/accessCardsApi";
import { parseErrorMessage } from "@/utils/parseErrorMessage";
import { useTenantStore } from "@/stores/useTenantStore";

const STORAGE_KEY = "access_card_password";

export function useAccessCardsGallery() {
  const tenant = useTenantStore((state) => state.tenant);
  const [password, setPassword] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(STORAGE_KEY) || "";
    }
    return "";
  });

  const {
    data: galleryResponse = null,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useGetAccessCardsGalleryQuery(password, {
    skip: !password || !tenant?.id,
  });

  const handleAuthenticate = useCallback(async (inputPassword: string) => {
    const trimmed = inputPassword.trim();
    setPassword(trimmed);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, trimmed);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!password) return;
    try {
      await refetch();
    } catch (err: unknown) {
      console.error("Refresh error:", err);
    }
  }, [password, refetch]);

  const errorMessage = queryError
    ? parseErrorMessage(
        queryError,
        "Failed to authenticate with the provided password."
      )
    : null;

  return {
    password,
    isAuthenticated: Boolean(galleryResponse?.data),
    isLoading: isLoading || isFetching,
    isRefreshing: isFetching,
    error: errorMessage,
    galleryResponse,
    handleAuthenticate,
    handleRefresh,
  };
}

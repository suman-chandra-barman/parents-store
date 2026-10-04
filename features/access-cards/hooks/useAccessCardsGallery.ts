"use client";

import { useState, useCallback } from "react";
import {
  useGetAccessCardsGalleryQuery,
  useLazyCheckTwoFactorStatusQuery,
  useLazyVerifyTwoFactorPasswordQuery,
} from "../api/accessCardsApi";
import type { TwoFactorStatusData } from "../types/access-cards";
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

  const [triggerCheck2FA, { isFetching: isChecking2FA }] =
    useLazyCheckTwoFactorStatusQuery();
  const [triggerVerify2FA, { isFetching: isVerifying2FA }] =
    useLazyVerifyTwoFactorPasswordQuery();

  const {
    data: galleryResponse = null,
    isLoading: isGalleryLoading,
    isFetching: isGalleryFetching,
    error: queryError,
    refetch,
  } = useGetAccessCardsGalleryQuery(password, {
    skip: !password || !tenant?.id,
  });

  const check2FAStatus = useCallback(
    async (inputPassword: string): Promise<TwoFactorStatusData> => {
      const trimmed = inputPassword.trim();
      const res = await triggerCheck2FA(trimmed).unwrap();
      return res.data;
    },
    [triggerCheck2FA],
  );

  const verify2FAPassword = useCallback(
    async (inputPassword: string, twoFactorPassword: string): Promise<boolean> => {
      const res = await triggerVerify2FA({
        password: inputPassword.trim(),
        twoFactorPassword: twoFactorPassword.trim(),
      }).unwrap();
      return Boolean(res?.data?.isMatch);
    },
    [triggerVerify2FA],
  );

  const handleAuthenticate = useCallback(async (formattedPassword: string) => {
    const trimmed = formattedPassword.trim();
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
        "Failed to authenticate with the provided password.",
      )
    : null;

  const isQueryPending = Boolean(password) && !galleryResponse && !queryError;
  const isOverallLoading = isGalleryLoading || isGalleryFetching || isQueryPending;

  return {
    password,
    isAuthenticated: Boolean(galleryResponse?.data),
    isLoading: isOverallLoading,
    isChecking2FA,
    isVerifying2FA,
    isRefreshing: isGalleryFetching,
    error: errorMessage,
    galleryResponse,
    check2FAStatus,
    verify2FAPassword,
    handleAuthenticate,
    handleRefresh,
  };
}

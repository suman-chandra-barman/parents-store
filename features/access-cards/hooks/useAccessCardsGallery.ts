"use client";

import { useState, useEffect, useCallback } from "react";
import { AccessCardsResponse } from "../types/access-cards";
import { fetchAccessCardsGallery } from "../utils/access-cards-api";

const STORAGE_KEY = "access_card_password";

export function useAccessCardsGallery() {
  const [password, setPassword] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryResponse, setGalleryResponse] =
    useState<AccessCardsResponse | null>(null);

  const handleAuthenticate = useCallback(async (inputPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAccessCardsGallery(inputPassword);
      setGalleryResponse(data);
      setPassword(inputPassword);
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, inputPassword);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to authenticate with the provided password.";
      setError(message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPass = sessionStorage.getItem(STORAGE_KEY);
      if (storedPass) {
        queueMicrotask(() => {
          handleAuthenticate(storedPass);
        });
      }
    }
  }, [handleAuthenticate]);

  const handleRefresh = async () => {
    if (!password) return;
    setIsRefreshing(true);
    try {
      const data = await fetchAccessCardsGallery(password);
      setGalleryResponse(data);
    } catch (err: unknown) {
      console.error("Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    password,
    isAuthenticated,
    isLoading,
    isRefreshing,
    error,
    galleryResponse,
    handleAuthenticate,
    handleRefresh,
  };
}

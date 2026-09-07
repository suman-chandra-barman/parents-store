"use client";

import { useSyncExternalStore, useCallback } from "react";
import { toast } from "sonner";

const FAVORITES_STORAGE_KEY = "lumiphoto_favorite_photo_ids";

let cachedRaw = "";
let cachedParsed: string[] = [];

function getFavoritesClientSnapshot(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const item = localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]";
    if (item !== cachedRaw) {
      cachedRaw = item;
      const parsed = JSON.parse(item);
      cachedParsed = Array.isArray(parsed) ? parsed : [];
    }
    return cachedParsed;
  } catch {
    return [];
  }
}

const SERVER_SNAPSHOT: string[] = [];

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("lumiphoto_favorites_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("lumiphoto_favorites_change", callback);
  };
}

function notifyFavoritesChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("lumiphoto_favorites_change"));
  }
}

export function useFavorites() {
  const favoriteIds = useSyncExternalStore(
    subscribe,
    getFavoritesClientSnapshot,
    () => SERVER_SNAPSHOT
  );

  const toggleFavorite = useCallback((photoId: string) => {
    const current = getFavoritesClientSnapshot();
    const exists = current.includes(photoId);
    const next = exists
      ? current.filter((id) => id !== photoId)
      : [...current, photoId];

    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      notifyFavoritesChange();
    } catch (err) {
      console.error("Failed to save favorites:", err);
    }

    if (exists) {
      toast.info("Removed photo from favorites");
    } else {
      toast.success("Added photo to favorites ❤️");
    }
  }, []);

  const isFavorited = useCallback(
    (photoId: string) => favoriteIds.includes(photoId),
    [favoriteIds]
  );

  const clearFavorites = useCallback(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, "[]");
      notifyFavoritesChange();
    } catch (err) {
      console.error("Failed to clear favorites:", err);
    }
    toast.info("Favorites cleared");
  }, []);

  return {
    favoriteIds,
    favoriteCount: favoriteIds.length,
    toggleFavorite,
    isFavorited,
    clearFavorites,
  };
}

"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Heart, PackageOpen, ArrowRight, ArrowLeft } from "lucide-react";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";
import { useAccessCardsGallery } from "@/features/access-cards/hooks/useAccessCardsGallery";
import { PhotoItem } from "@/features/access-cards/types/access-cards";
import { FavoritesEmptyState } from "./FavoritesEmptyState";
import { FavoritesActionBar } from "./FavoritesActionBar";
import { FavoritePhotoGrid } from "./FavoritePhotoGrid";

export function FavoritesContent() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Favorites");

  const { favoriteIds, toggleFavorite, clearFavorites } = useFavorites();
  const { galleryResponse } = useAccessCardsGallery();

  // Extract known photos from active access card session (if any)
  const knownPhotosMap = useMemo(() => {
    const map = new Map<string, PhotoItem>();
    const folders = galleryResponse?.data?.folders || [];
    const uncategorized = galleryResponse?.data?.uncategorized || [];

    folders.forEach((f) => {
      f.photos.forEach((p) => {
        map.set(p.id, { ...p, album: p.album || f.album });
      });
    });

    uncategorized.forEach((p) => {
      map.set(p.id, p);
    });

    return map;
  }, [galleryResponse]);

  // Construct PhotoItem array for all favorited IDs
  const favoritePhotos: PhotoItem[] = useMemo(() => {
    return favoriteIds.map((id) => {
      if (knownPhotosMap.has(id)) {
        return knownPhotosMap.get(id)!;
      }
      return { id };
    });
  }, [favoriteIds, knownPhotosMap]);

  const handleSelectPhoto = useCallback(
    (photo: PhotoItem) => {
      router.push(`/${locale}/favorites/${photo.id}`);
    },
    [router, locale]
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/photo-galleries/access-cards`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mr-2"
              >
                <ArrowLeft className="size-3.5" />
                <span>Gallery</span>
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {t("title")}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Toolbar & Action Bar (Single primary CTA) */}
        {favoriteIds.length > 0 && (
          <FavoritesActionBar
            favoriteCount={favoriteIds.length}
            onClearAll={clearFavorites}
          />
        )}

        {/* Content Body */}
        {favoriteIds.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {t("selectFormatHint")}
            </p>

            <FavoritePhotoGrid
              photos={favoritePhotos}
              onUnfavorite={toggleFavorite}
              onSelectPhoto={handleSelectPhoto}
            />
          </div>
        )}
      </div>
    </div>
  );
}

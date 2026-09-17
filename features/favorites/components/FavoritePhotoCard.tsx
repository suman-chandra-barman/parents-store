"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Heart, Eye, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoItem } from "@/features/access-cards/types/access-cards";
import { fetchPhotoPreviewBlob } from "@/features/access-cards/utils/access-cards-api";
import { PhotoCardErrorFallback } from "@/features/access-cards/components/PhotoCardErrorFallback";

export interface FavoritePhotoCardProps {
  photo: PhotoItem;
  index: number;
  onUnfavorite: (photoId: string) => void;
  onSelect: (photo: PhotoItem, index: number) => void;
}

export function FavoritePhotoCard({
  photo,
  index,
  onUnfavorite,
  onSelect,
}: FavoritePhotoCardProps) {
  const t = useTranslations("Favorites");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    fetchPhotoPreviewBlob(photo.id)
      .then((url) => {
        if (isMounted) {
          setBlobUrl(url);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        console.error(`Failed to load favorite photo ${photo.id}:`, err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [photo.id, retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setRetryCount((prev) => prev + 1);
  };

  const albumName = photo.album?.name || `Photo #${index + 1}`;

  return (
    <div
      onClick={() => !loading && !error && onSelect(photo, index)}
      onContextMenu={(e) => e.preventDefault()}
      className="group relative w-full overflow-hidden bg-card rounded-2xl border border-neutral-200/80 mb-3 break-inside-avoid select-none cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-brand/40"
    >
      {/* Loading Skeleton */}
      {loading && (
        <div className="w-full aspect-4/3 bg-muted/60 animate-pulse flex flex-col items-center justify-center gap-2">
          <Layers className="size-7 text-brand/30 animate-bounce" />
          <span className="text-xs text-muted-foreground font-mono">
            Loading...
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {error && <PhotoCardErrorFallback onRetry={handleRetry} />}

      {/* Image Preview */}
      {blobUrl && !loading && !error && (
        <div className="relative w-full overflow-hidden">
          <Image
            src={blobUrl}
            alt={albumName}
            width={0}
            height={0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="w-full h-auto block object-cover transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
          />

          {/* Top-Right: Unfavorite Button */}
          <div className="absolute top-2.5 right-2.5 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onUnfavorite(photo.id);
              }}
              title={t("unfavorite")}
              aria-label={t("unfavorite")}
              className="size-8.5 rounded-xl bg-rose-500 text-white flex items-center justify-center transition-all shadow-md hover:bg-rose-600 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Heart className="size-4.5 fill-white text-white" />
            </button>
          </div>

          {/* Hover Overlay with Details Trigger */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 pointer-events-none">
            <div className="flex items-center justify-between text-white">
              <span className="text-xs font-semibold drop-shadow-sm truncate pr-2">
                {albumName}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg shrink-0">
                <Eye className="size-3.5" />
                <span>{t("viewDetails")}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

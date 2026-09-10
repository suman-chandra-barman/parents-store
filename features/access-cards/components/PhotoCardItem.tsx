"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Heart, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoItem } from "../types/access-cards";
import { fetchPhotoPreviewBlob } from "../utils/access-cards-api";
import { PhotoCardErrorFallback } from "./PhotoCardErrorFallback";

export interface PhotoCardItemProps {
  photo: PhotoItem;
  index: number;
  isFavorited: boolean;
  onToggleFavorite?: (photoId: string) => void;
  onSelect?: (photo: PhotoItem, index: number) => void;
}

export function PhotoCardItem({
  photo,
  index,
  isFavorited,
  onToggleFavorite,
  onSelect,
}: PhotoCardItemProps) {
  const t = useTranslations("PhotoCard");
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
        console.error(`Failed to load photo ${photo.id}:`, err);
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

  const albumName = photo.album?.name || "Photo";

  return (
    <div
      onClick={() => !loading && !error && onSelect?.(photo, index)}
      onContextMenu={(e) => e.preventDefault()}
      className="group relative w-full overflow-hidden bg-muted/20 rounded-xs mb-2 break-inside-avoid select-none cursor-pointer transition-all duration-300 hover:shadow-xl hover:brightness-[1.02]"
    >
      {/* Loading Skeleton */}
      {loading && (
        <div className="w-full aspect-4/3 bg-muted/60 animate-pulse flex flex-col items-center justify-center gap-2">
          <Layers className="size-7 text-brand/30 animate-bounce" />
          <span className="text-xs text-muted-foreground font-mono">
            {t("loading")}
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {error && <PhotoCardErrorFallback onRetry={handleRetry} />}

      {/* Natural Aspect Ratio Photo */}
      {blobUrl && !loading && !error && (
        <div className="relative w-full overflow-hidden">
          <Image
            src={blobUrl}
            alt={albumName}
            width={0}
            height={0}
            sizes="100vw"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="w-full h-auto block object-cover transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
          />

          {/* Top-Right: Favorite Button */}
          {onToggleFavorite && (
            <div className="absolute top-2 right-2 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleFavorite(photo.id);
                }}
                title={
                  isFavorited ? t("removeFromFavorites") : t("addToFavorites")
                }
                aria-label={
                  isFavorited ? t("removeFromFavorites") : t("addToFavorites")
                }
                className={cn(
                  "size-8 rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer",
                  isFavorited
                    ? "bg-rose-500 text-white scale-110 shadow-rose-500/40"
                    : "bg-black/50 text-white/80 hover:text-rose-400 hover:bg-black/70 backdrop-blur-md opacity-80 group-hover:opacity-100",
                )}
              >
                <Heart
                  className={cn(
                    "size-4 transition-transform active:scale-125",
                    isFavorited ? "fill-white text-white" : "",
                  )}
                />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoItem } from "../types/access-cards";
import { fetchPhotoPreviewBlob } from "../utils/access-cards-api";
import { Heart, Images, Layers, ImageOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoGridProps {
  photos: PhotoItem[];
  isLoading?: boolean;
  favoriteIds?: string[];
  onToggleFavorite?: (photoId: string) => void;
  onSelectPhoto?: (photo: PhotoItem, index: number) => void;
}

interface PhotoCardItemProps {
  photo: PhotoItem;
  index: number;
  isFavorited: boolean;
  onToggleFavorite?: (photoId: string) => void;
  onSelect?: (photo: PhotoItem, index: number) => void;
}

function PhotoCardItem({
  photo,
  index,
  isFavorited,
  onToggleFavorite,
  onSelect,
}: PhotoCardItemProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

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
  }, [photo.id]);

  const rotation = photo.rotationAngle || 0;
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
          <span className="text-[11px] text-muted-foreground font-mono">
            Loading...
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {error && (
        <div className="w-full aspect-4/3 bg-destructive/5 flex flex-col items-center justify-center p-4 text-center">
          <ImageOff className="size-6 text-destructive mb-1.5" />
          <span className="text-xs text-destructive font-medium">
            Failed to load preview
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLoading(true);
              setError(false);
              fetchPhotoPreviewBlob(photo.id)
                .then((url) => {
                  setBlobUrl(url);
                  setLoading(false);
                })
                .catch(() => setError(true));
            }}
            className="mt-2 text-xs flex items-center gap-1 text-brand underline font-medium cursor-pointer"
          >
            <RefreshCw className="size-3" /> Retry
          </button>
        </div>
      )}

      {/* Natural Aspect Ratio Photo (Takes natural size of image) */}
      {blobUrl && !loading && !error && (
        <div className="relative w-full overflow-hidden">
          <Image
            src={blobUrl}
            alt={albumName}
            unoptimized
            width={0}
            height={0}
            sizes="100vw"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{
              width: "100%",
              height: "auto",
              transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
            }}
            className="w-full h-auto block object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] pointer-events-none"
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
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                className={cn(
                  "size-7.5 rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer",
                  isFavorited
                    ? "bg-rose-500 text-white scale-110 shadow-rose-500/40"
                    : "bg-black/50 text-white/80 hover:text-rose-400 hover:bg-black/70 backdrop-blur-md opacity-80 group-hover:opacity-100"
                )}
              >
                <Heart
                  className={cn(
                    "size-4 transition-transform active:scale-125",
                    isFavorited ? "fill-white text-white" : ""
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

export function PhotoGrid({
  photos,
  isLoading = false,
  favoriteIds = [],
  onToggleFavorite,
  onSelectPhoto,
}: PhotoGridProps) {
  if (isLoading) {
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 space-y-2">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full aspect-4/3 rounded-xs bg-muted/60 animate-pulse border border-border/30 flex flex-col items-center justify-center gap-2 break-inside-avoid mb-2"
          >
            <Layers className="size-7 text-brand/30 animate-bounce" />
            <span className="text-[11px] text-muted-foreground font-mono">
              Loading photos...
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center bg-card rounded-2xl border border-border/50 shadow-xs">
        <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
          <Images className="size-6" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">No photos found</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          There are no photos available in this gallery.
        </p>
      </div>
    );
  }

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 space-y-2 w-full select-none"
    >
      {photos.map((photo, index) => (
        <PhotoCardItem
          key={photo.id}
          photo={photo}
          index={index}
          isFavorited={favoriteIds.includes(photo.id)}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelectPhoto}
        />
      ))}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoItem } from "../types/access-cards";
import { fetchPhotoPreviewBlob } from "../utils/access-cards-api";
import { Maximize2, RotateCw, ImageOff, RefreshCw, Layers, Check } from "lucide-react";

interface PhotoCardProps {
  photo: PhotoItem;
  index: number;
  onSelect: (photo: PhotoItem, index: number) => void;
  isSelected?: boolean;
  onToggleSelect?: (photoId: string, e: React.MouseEvent) => void;
}

export function PhotoCard({
  photo,
  index,
  onSelect,
  isSelected = false,
  onToggleSelect,
}: PhotoCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // PhotoCard is keyed by photo.id, so it remounts (fresh loading/error/imageUrl
  // state) whenever the photo changes. State is only updated in async callbacks.
  useEffect(() => {
    let isMounted = true;

    fetchPhotoPreviewBlob(photo.id)
      .then((url) => {
        if (isMounted) {
          setImageUrl(url);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        console.error(`Failed loading blob for photo ${photo.id}:`, err);
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

  return (
    <div
      onClick={() => !loading && !error && onSelect(photo, index)}
      onContextMenu={(e) => e.preventDefault()}
      className={`group relative bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-center items-center aspect-[4/3] select-none ${
        isSelected
          ? "border-brand ring-2 ring-brand/40 shadow-md scale-[1.01]"
          : "border-border hover:border-brand/40"
      }`}
    >
      {onToggleSelect && !loading && !error && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(photo.id, e);
          }}
          title={isSelected ? "Deselect for order" : "Select for order"}
          className={`absolute top-3 left-3 z-20 size-7 rounded-xl flex items-center justify-center transition-all shadow-md ${
            isSelected
              ? "bg-brand text-white scale-110"
              : "bg-black/50 text-white/70 hover:text-white hover:bg-brand/80 backdrop-blur-md opacity-80 group-hover:opacity-100"
          }`}
        >
          <Check className={`size-4 ${isSelected ? "stroke-[3]" : ""}`} />
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-muted/60 animate-pulse flex flex-col items-center justify-center gap-2">
          <Layers className="size-8 text-brand/50 animate-bounce" />
          <span className="text-xs text-muted-foreground font-mono">Loading Photo...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-destructive/5 flex flex-col items-center justify-center p-4 text-center">
          <ImageOff className="size-8 text-destructive mb-2" />
          <span className="text-xs text-destructive font-medium">Failed to load preview</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLoading(true);
              setError(false);
              fetchPhotoPreviewBlob(photo.id)
                .then((url) => {
                  setImageUrl(url);
                  setLoading(false);
                })
                .catch(() => setError(true));
            }}
            className="mt-2 text-xs flex items-center gap-1 text-brand underline font-medium"
          >
            <RefreshCw className="size-3" /> Retry
          </button>
        </div>
      )}

      {imageUrl && !loading && !error && (
        <div className="relative w-full h-full flex items-center justify-center p-2 overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Photo ${photo.id}`}
            unoptimized
            fill
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{
              transform: `rotate(${rotation}deg)`,
              objectFit: "contain",
            }}
            className="transition-transform duration-300 group-hover:scale-105 pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
            <div className="flex items-center justify-between pl-8">
              {rotation !== 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-black/60 text-amber-300 backdrop-blur-md border border-amber-500/30">
                  <RotateCw className="size-3" /> {rotation}°
                </span>
              ) : (
                <div />
              )}
              <span className="p-1.5 rounded-full bg-brand text-white shadow-md backdrop-blur-md hover:scale-110 transition-transform">
                <Maximize2 className="size-4" />
              </span>
            </div>

            <div className="space-y-0.5 text-white">
              <div className="text-xs font-semibold truncate">
                {photo.album?.name || "Access Card Photo"}
              </div>
              <div className="text-xs font-mono text-zinc-300 truncate">
                ID: {photo.id.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

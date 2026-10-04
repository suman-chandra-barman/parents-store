"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, ImageOff } from "lucide-react";
import { PhotoItem } from "../types/access-cards";
import { getPhotoDirectUrl } from "../utils/access-cards-api";

export interface GalleryPhotoCardProps {
  photo: PhotoItem;
  albumName?: string;
  dotColor?: string;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect?: (photo: PhotoItem) => void;
}

export function GalleryPhotoCard({
  photo,
  albumName = "Album",
  dotColor = "#FF5A36",
  isFavorited,
  onToggleFavorite,
  onSelect,
}: GalleryPhotoCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const imageUrl = photo.id ? getPhotoDirectUrl(photo.id) : "";

  return (
    <div
      onClick={() => onSelect?.(photo)}
      className="group relative w-full aspect-3/4 rounded-3xl overflow-hidden bg-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 select-none cursor-pointer"
    >
      {/* Loading Skeleton */}
      {imageLoading && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse z-1" />
      )}

      {/* Photo Image */}
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt={`${albumName} photo`}
          fill
          unoptimized
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 gap-2 p-4 text-center">
          <ImageOff className="size-8 text-neutral-300" />
          <span className="text-xs font-semibold text-neutral-500 truncate max-w-40">
            {albumName}
          </span>
        </div>
      )}

      {/* Top Left: Album Pill Tag */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[11px] font-bold shadow-xs max-w-48">
          <span
            className="size-2 rounded-full shrink-0"
            style={{ backgroundColor: dotColor }}
          />
          <span className="truncate">{albumName}</span>
        </div>
      </div>

      {/* Bottom Right: Favorite Action */}
      <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center">
        {/* Heart Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(photo.id);
          }}
          className="size-11 rounded-full bg-white hover:bg-neutral-50 shadow-md flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`size-5 stroke-[2.2] transition-colors ${
              isFavorited
                ? "fill-[#FF5A36] text-[#FF5A36]"
                : "text-[#FF5A36] fill-transparent"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

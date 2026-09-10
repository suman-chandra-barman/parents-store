"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Maximize2,
  Heart,
  Layers,
  ImageOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoItem } from "../types/access-cards";

export interface PhotoDetailsPreviewProps {
  photo: PhotoItem;
  photos: PhotoItem[];
  currentIndex: number;
  blobUrl: string | null;
  loading: boolean;
  error: boolean;
  isFavorited: boolean;
  onToggleFavorite: (photoId: string) => void;
  onNavigate: (index: number) => void;
  onOpenFullscreen: () => void;
}

export function PhotoDetailsPreview({
  photo,
  photos,
  currentIndex,
  blobUrl,
  loading,
  error,
  isFavorited,
  onToggleFavorite,
  onNavigate,
  onOpenFullscreen,
}: PhotoDetailsPreviewProps) {
  const totalPhotos = photos.length;
  const rotation = photo.rotationAngle || 0;

  const handleFirst = () => onNavigate(0);
  const handlePrev = () => onNavigate(currentIndex > 0 ? currentIndex - 1 : totalPhotos - 1);
  const handleNext = () => onNavigate(currentIndex < totalPhotos - 1 ? currentIndex + 1 : 0);
  const handleLast = () => onNavigate(totalPhotos - 1);

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Main Photo Card Box */}
      <div
        onClick={onOpenFullscreen}
        onContextMenu={(e) => e.preventDefault()}
        className="group relative w-full aspect-3/4 max-w-lg bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm flex items-center justify-center cursor-pointer select-none transition-all duration-300 hover:shadow-lg hover:border-neutral-300"
      >
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
            <Layers className="size-8 text-brand animate-bounce" />
            <span className="text-xs font-mono">Loading high-res preview...</span>
          </div>
        )}

        {/* Error fallback */}
        {error && (
          <div className="flex flex-col items-center justify-center gap-2 text-red-500 p-6 text-center">
            <ImageOff className="size-8" />
            <span className="text-xs font-medium">Failed to load photo</span>
          </div>
        )}

        {/* Photo Image */}
        {blobUrl && !loading && !error && (
          <div className="relative w-full h-full p-2 flex items-center justify-center">
            <Image
              src={blobUrl}
              alt={photo.album?.name || "Photo preview"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{
                transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
                objectFit: "contain",
              }}
              className="pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-medium backdrop-blur-md shadow-md">
                <Maximize2 className="size-3.5" />
                Click to expand
              </span>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(photo.id);
          }}
          className={cn(
            "absolute top-3 right-3 z-10 size-9 rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer",
            isFavorited
              ? "bg-rose-500 text-white shadow-rose-500/40 scale-105"
              : "bg-white/80 text-neutral-700 hover:text-rose-500 hover:bg-white backdrop-blur-md"
          )}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn("size-4.5", isFavorited ? "fill-white text-white" : "")}
          />
        </button>
      </div>

      {/* Pagination Controls */}
      {totalPhotos > 1 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 text-neutral-700 select-none">
          {/* First */}
          <button
            type="button"
            onClick={handleFirst}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="First photo"
            aria-label="First photo"
          >
            <ChevronsLeft className="size-5" />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            title="Previous photo"
            aria-label="Previous photo"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Current index display */}
          <span className="text-sm font-medium text-neutral-800 px-3 py-1 bg-neutral-100 rounded-md font-mono">
            {currentIndex + 1} out of {totalPhotos}
          </span>

          {/* Next */}
          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            title="Next photo"
            aria-label="Next photo"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Last */}
          <button
            type="button"
            onClick={handleLast}
            disabled={currentIndex === totalPhotos - 1}
            className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Last photo"
            aria-label="Last photo"
          >
            <ChevronsRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}

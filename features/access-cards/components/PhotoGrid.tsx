"use client";

import React from "react";
import { PhotoItem, ViewMode } from "../types/access-cards";
import { PhotoCard } from "./PhotoCard";
import { SearchX, Images } from "lucide-react";

interface PhotoGridProps {
  photos: PhotoItem[];
  viewMode: ViewMode;
  onSelectPhoto: (photo: PhotoItem, index: number) => void;
  isLoading?: boolean;
  selectedPhotoIds?: string[];
  onToggleSelectPhoto?: (photoId: string, e: React.MouseEvent) => void;
}

export function PhotoGrid({
  photos,
  viewMode,
  onSelectPhoto,
  isLoading = false,
  selectedPhotoIds = [],
  onToggleSelectPhoto,
}: PhotoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-[4/3] rounded-2xl bg-muted/60 animate-pulse border border-border flex items-center justify-center"
          >
            <Images className="size-8 text-muted-foreground/40 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
        <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
          <SearchX className="size-6" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">No photos found</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          There are no photos matching the criteria in this section.
        </p>
      </div>
    );
  }

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={
        viewMode === "masonry"
          ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 select-none"
          : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 select-none"
      }
    >
      {photos.map((photo, index) => (
        <div key={photo.id} className={viewMode === "masonry" ? "break-inside-avoid" : ""}>
          <PhotoCard
            photo={photo}
            index={index}
            onSelect={onSelectPhoto}
            isSelected={selectedPhotoIds.includes(photo.id)}
            onToggleSelect={onToggleSelectPhoto}
          />
        </div>
      ))}
    </div>
  );
}

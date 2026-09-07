"use client";

import React from "react";
import { PhotoItem } from "../types/access-cards";
import { PhotoCardItem } from "./PhotoCardItem";
import { PhotoGridSkeleton } from "./PhotoGridSkeleton";
import { PhotoGridEmptyState } from "./PhotoGridEmptyState";

export interface AccessCardPhotoGridProps {
  photos: PhotoItem[];
  isLoading?: boolean;
  favoriteIds?: string[];
  onToggleFavorite?: (photoId: string) => void;
  onSelectPhoto?: (photo: PhotoItem, index: number) => void;
}

export function AccessCardPhotoGrid({
  photos,
  isLoading = false,
  favoriteIds = [],
  onToggleFavorite,
  onSelectPhoto,
}: AccessCardPhotoGridProps) {
  if (isLoading) {
    return <PhotoGridSkeleton />;
  }

  if (photos.length === 0) {
    return <PhotoGridEmptyState />;
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

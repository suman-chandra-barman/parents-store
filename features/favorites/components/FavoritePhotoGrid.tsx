"use client";

import React from "react";
import { PhotoItem } from "@/features/access-cards/types/access-cards";
import { FavoritePhotoCard } from "./FavoritePhotoCard";

export interface FavoritePhotoGridProps {
  photos: PhotoItem[];
  onUnfavorite: (photoId: string) => void;
  onSelectPhoto: (photo: PhotoItem, index: number) => void;
}

export function FavoritePhotoGrid({
  photos,
  onUnfavorite,
  onSelectPhoto,
}: FavoritePhotoGridProps) {
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-4 gap-3 space-y-3 w-full select-none"
    >
      {photos.map((photo, index) => (
        <FavoritePhotoCard
          key={photo.id}
          photo={photo}
          index={index}
          onUnfavorite={onUnfavorite}
          onSelect={onSelectPhoto}
        />
      ))}
    </div>
  );
}

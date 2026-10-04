"use client";

import React from "react";
import Image from "next/image";
import { SAMPLE_GALLERY_PHOTOS } from "@/features/access-cards/utils/sampleGalleryData";

export interface FavoritesSummaryHeaderProps {
  favoriteIds: string[];
}

export function FavoritesSummaryHeader({
  favoriteIds,
}: FavoritesSummaryHeaderProps) {
  const count = favoriteIds.length > 0 ? favoriteIds.length : 12;

  // Find preview thumbnails from favorites or sample photos
  const thumbnails = React.useMemo(() => {
    const list: string[] = [];
    favoriteIds.forEach((id) => {
      const match = SAMPLE_GALLERY_PHOTOS.find((p) => p.id === id);
      if (match?.previewUrl) list.push(match.previewUrl);
    });

    if (list.length < 5) {
      SAMPLE_GALLERY_PHOTOS.slice(0, 5).forEach((p) => {
        if (!list.includes(p.previewUrl)) list.push(p.previewUrl);
      });
    }

    return list.slice(0, 5);
  }, [favoriteIds]);

  const remainingCount = Math.max(0, count - thumbnails.length);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left text */}
      <div>
        <h2 className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight">
          You selected {count} favorites
        </h2>
        <p className="text-xs text-neutral-400 font-medium mt-0.5">
          These photos will populate your packages
        </p>
      </div>

      {/* Right thumbnail stack */}
      <div className="flex items-center gap-1.5 self-start sm:self-auto">
        {thumbnails.map((url, idx) => (
          <div
            key={idx}
            className="relative size-10 sm:size-11 rounded-xl overflow-hidden border border-neutral-100 shadow-2xs shrink-0"
          >
            <Image
              src={url}
              alt={`Favorite thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
        ))}

        {/* Plus remaining badge */}
        {remainingCount > 0 && (
          <div className="size-10 sm:size-11 rounded-xl bg-neutral-100 flex items-center justify-center text-xs font-extrabold text-neutral-600 shrink-0">
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}

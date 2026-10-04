"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getPhotoDirectUrl } from "../utils/access-cards-api";

export interface DynamicAlbumFilter {
  id: string;
  name: string;
  count: number;
  thumbnailPhotoId?: string;
  thumbnailUrl?: string;
  dotColor?: string;
  activeBgColor?: string;
}

export interface GalleryFilterBarProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  albums: DynamicAlbumFilter[];
  totalPhotosCount: number;
}

export function GalleryFilterBar({
  selectedFilter,
  onFilterChange,
  albums,
  totalPhotosCount,
}: GalleryFilterBarProps) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-neutral-200/60 mb-6">
      {/* Left instructions */}
      <p className="text-sm font-bold text-neutral-800 tracking-tight">
        Please choose the photos you like first and mark them with a heart!
      </p>

      {/* Right switcher pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        {/* All Photos */}
        <button
          type="button"
          onClick={() => onFilterChange("ALL")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0",
            selectedFilter === "ALL"
              ? "bg-neutral-800 text-white shadow-xs"
              : "bg-neutral-200/70 text-neutral-700 hover:bg-neutral-300",
          )}
        >
          All Photos {totalPhotosCount > 0 ? `(${totalPhotosCount})` : ""}
        </button>

        {/* Dynamic Album Pills */}
        {albums.map((album) => {
          const isSelected = selectedFilter === album.id;
          const dotColor = album.dotColor || "#FF5A36";
          const activeBg = album.activeBgColor || "#FFF2EE";
          const resolvedThumbnail =
            album.thumbnailUrl ||
            (album.thumbnailPhotoId ? getPhotoDirectUrl(album.thumbnailPhotoId) : null);

          return (
            <button
              key={album.id}
              type="button"
              onClick={() => onFilterChange(album.id)}
              style={
                isSelected
                  ? {
                      borderColor: dotColor,
                      backgroundColor: activeBg,
                      color: dotColor,
                    }
                  : undefined
              }
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border-2 shrink-0",
                isSelected
                  ? "shadow-xs"
                  : "bg-neutral-200/70 text-neutral-700 hover:bg-neutral-300 border-transparent",
              )}
            >
              <div className="relative size-5 rounded-full overflow-hidden border border-white shrink-0 bg-neutral-300 flex items-center justify-center">
                {resolvedThumbnail ? (
                  <Image
                    src={resolvedThumbnail}
                    alt={album.name}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="20px"
                  />
                ) : (
                  <span
                    className="size-full flex items-center justify-center text-[10px] text-white font-black"
                    style={{ backgroundColor: dotColor }}
                  >
                    {album.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span>
                {album.name} ({album.count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

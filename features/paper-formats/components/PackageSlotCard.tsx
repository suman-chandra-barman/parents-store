"use client";

import React from "react";
import { PackageSlotItem } from "../types/paper-formats";
import { PackagePhotoPlaceholder } from "./PackagePhotoPlaceholder";
import { cn } from "@/lib/utils";

interface PackageSlotCardProps {
  slot: PackageSlotItem;
  selectedPhotoIds: string[];
  onSelectPlaceholder: (index: number) => void;
  error?: string;
}

export function PackageSlotCard({
  slot,
  selectedPhotoIds = [],
  onSelectPlaceholder,
  error,
}: PackageSlotCardProps) {
  const slotTitle = slot.title || slot.size?.title || "Photos";
  const maxCount = Math.max(1, slot.maxQuantity || 1);
  const sizeTitle = slot.size?.title;

  // Selected count
  const filledCount = selectedPhotoIds.filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header matching user design: "Title | Size (X Image Slots)" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm sm:text-base font-bold text-neutral-900">
            {slotTitle}
            {sizeTitle && (
              <span className="text-neutral-400 font-normal ml-1.5">
                | {sizeTitle}
              </span>
            )}
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>
            {filledCount} of {maxCount} selected
          </span>
          <span
            className={cn(
              "size-2 rounded-full",
              filledCount === maxCount ? "bg-emerald-500" : "bg-amber-400"
            )}
          />
        </div>
      </div>

      {/* Responsive Placeholders Grid */}
      <div
        className={cn(
          "grid gap-3 sm:gap-4",
          maxCount === 1
            ? "grid-cols-1 sm:grid-cols-2 max-w-md"
            : maxCount === 2
              ? "grid-cols-2 sm:grid-cols-2"
              : maxCount === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : maxCount === 4
                  ? "grid-cols-2 sm:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
        )}
      >
        {Array.from({ length: maxCount }).map((_, idx) => {
          const currentPhotoId = selectedPhotoIds[idx];

          return (
            <PackagePhotoPlaceholder
              key={idx}
              photoId={currentPhotoId}
              index={idx}
              totalCount={maxCount}
              onClick={() => onSelectPlaceholder(idx)}
            />
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium pt-1">{error}</p>
      )}
    </div>
  );
}

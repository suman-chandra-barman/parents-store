"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Loader2, Check, RefreshCw } from "lucide-react";
import { fetchPhotoPreviewBlob } from "@/features/access-cards/utils/access-cards-api";
import { cn } from "@/lib/utils";

interface PackagePhotoPlaceholderProps {
  photoId?: string;
  index: number;
  totalCount: number;
  onClick: () => void;
  onRemove?: () => void;
}

export function PackagePhotoPlaceholder({
  photoId,
  index,
  totalCount,
  onClick,
}: PackagePhotoPlaceholderProps) {
  const [loadedData, setLoadedData] = useState<{ id: string; url: string } | null>(null);

  const photoUrl = photoId && loadedData?.id === photoId ? loadedData.url : null;
  const isLoading = Boolean(photoId && !photoUrl);

  useEffect(() => {
    if (!photoId) return;

    let isMounted = true;

    fetchPhotoPreviewBlob(photoId)
      .then((url) => {
        if (isMounted) {
          setLoadedData({ id: photoId, url });
        }
      })
      .catch((err) => {
        console.error("Failed to load photo preview:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [photoId]);

  if (photoId && photoUrl) {
    return (
      <div
        onClick={onClick}
        className="group relative aspect-square sm:aspect-4/5 rounded-2xl overflow-hidden border-2 border-neutral-200 bg-neutral-100 cursor-pointer shadow-xs hover:shadow-md hover:border-[#2060b0] transition-all"
        role="button"
        tabIndex={0}
        aria-label={`Photo ${index + 1} of ${totalCount}`}
      >
        <Image
          src={photoUrl}
          alt={`Selected photo slot ${index + 1}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          className="object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Index Badge */}
        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          #{index + 1}
        </div>

        {/* Selected Checkmark */}
        <div className="absolute top-2.5 right-2.5 size-5 rounded-full bg-[#2060b0] text-white flex items-center justify-center shadow-xs">
          <Check className="size-3 stroke-[3]" />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
          <div className="size-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <RefreshCw className="size-4 text-white" />
          </div>
          <span className="text-[11px] font-semibold">Change photo</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="aspect-square sm:aspect-4/5 rounded-2xl border-2 border-neutral-200 bg-neutral-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="size-6 animate-spin text-[#2060b0]" />
        <span className="text-[10px] font-medium text-neutral-400 mt-2">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative aspect-square sm:aspect-4/5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center p-4",
        "bg-[#eef2f6] border-[#cbd5e1] hover:border-[#2060b0] hover:bg-[#e8eef8]"
      )}
      role="button"
      tabIndex={0}
      aria-label={`Add photo ${index + 1} of ${totalCount}`}
    >
      <div className="size-10 sm:size-12 rounded-full bg-white shadow-xs border border-neutral-200 flex items-center justify-center group-hover:border-[#2060b0] group-hover:scale-110 transition-all">
        <Plus className="size-5 sm:size-6 text-neutral-400 group-hover:text-[#2060b0] transition-colors stroke-[2]" />
      </div>
      <span className="text-xs font-semibold text-neutral-500 group-hover:text-[#2060b0] mt-2 transition-colors">
        Photo {index + 1}
      </span>
    </div>
  );
}

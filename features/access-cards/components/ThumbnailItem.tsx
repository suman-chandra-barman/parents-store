"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoItem } from "../types/access-cards";
import { fetchPhotoPreviewBlob } from "../utils/access-cards-api";

interface ThumbnailItemProps {
  photo: PhotoItem;
  isActive: boolean;
  onClick: () => void;
}

export function ThumbnailItem({ photo, isActive, onClick }: ThumbnailItemProps) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchPhotoPreviewBlob(photo.id)
      .then((url) => {
        if (isMounted) setThumbUrl(url);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [photo.id]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative size-14 sm:size-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
        isActive
          ? "border-brand ring-4 ring-brand/30 scale-105 z-10"
          : "border-zinc-700 opacity-60 hover:opacity-100 hover:border-zinc-500"
      }`}
    >
      {thumbUrl ? (
        <Image
          src={thumbUrl}
          alt="thumb"
          unoptimized
          fill
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{ transform: `rotate(${photo.rotationAngle || 0}deg)`, objectFit: "cover" }}
          className="pointer-events-none"
        />
      ) : (
        <div className="w-full h-full bg-zinc-800 animate-pulse" />
      )}
    </button>
  );
}

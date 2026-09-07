"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PhotoItem } from "../types/access-cards";
import { fetchPhotoPreviewBlob } from "../utils/access-cards-api";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Loader2,
  ImageOff,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FullscreenPhotoViewerProps {
  photos: PhotoItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (photoId: string) => void;
}

export function FullscreenPhotoViewer({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  favoriteIds = [],
  onToggleFavorite,
}: FullscreenPhotoViewerProps) {
  const currentPhoto = isOpen && currentIndex >= 0 ? photos[currentIndex] : null;
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Load photo blob on photo change
  useEffect(() => {
    if (!isOpen || !currentPhoto) return;

    let isMounted = true;
    fetchPhotoPreviewBlob(currentPhoto.id)
      .then((url) => {
        if (isMounted) {
          setBlobUrl(url);
          setLoading(false);
          setError(false);
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to load photo in viewer:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentPhoto, isOpen]);

  const handlePrev = useCallback(() => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : photos.length - 1);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate(currentIndex < photos.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, photos.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  if (!isOpen || !currentPhoto) return null;

  const isFavorited = favoriteIds.includes(currentPhoto.id);
  const rotation = currentPhoto.rotationAngle || 0;

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl text-white select-none animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 bg-linear-to-b from-black/80 to-transparent z-20">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-300">
            {currentIndex + 1} / {photos.length}
          </span>
          {currentPhoto.album?.name && (
            <span className="text-xs font-semibold text-white/90 truncate max-w-xs">
              {currentPhoto.album.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(currentPhoto.id)}
              className={cn(
                "p-2 rounded-xl transition-all cursor-pointer",
                isFavorited
                  ? "bg-rose-500 text-white scale-105 shadow-rose-500/30"
                  : "bg-white/10 hover:bg-white/20 text-white"
              )}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn("size-4.5", isFavorited ? "fill-white" : "")}
              />
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="size-4.5" />
            ) : (
              <Maximize2 className="size-4.5" />
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500 text-white transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="size-4.5" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
            title="Previous (←)"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        {/* Image Container */}
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-2">
              <Loader2 className="size-8 text-brand animate-spin" />
              <span className="text-xs font-mono text-zinc-400">Loading photo...</span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center gap-2 text-center p-6 bg-zinc-900/80 rounded-2xl border border-red-500/20">
              <ImageOff className="size-8 text-red-400" />
              <span className="text-xs text-red-400 font-medium">Failed to load photo</span>
            </div>
          )}

          {blobUrl && !loading && !error && (
            <Image
              src={blobUrl}
              alt={currentPhoto.album?.name || "Photo"}
              unoptimized
              fill
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{
                transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
                objectFit: "contain",
              }}
              className="transition-all duration-200 ease-out pointer-events-none drop-shadow-2xl"
            />
          )}
        </div>

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
            title="Next (→)"
          >
            <ChevronRight className="size-6" />
          </button>
        )}
      </div>
    </div>
  );
}

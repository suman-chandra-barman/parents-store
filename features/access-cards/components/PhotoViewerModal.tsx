"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PhotoItem } from "../types/access-cards";
import { fetchPhotoPreviewBlob } from "../utils/access-cards-api";
import { PhotoViewerControls } from "./PhotoViewerControls";
import { ThumbnailItem } from "./ThumbnailItem";
import { ChevronLeft, ChevronRight, Loader2, ImageOff } from "lucide-react";

interface PhotoViewerModalProps {
  photos: PhotoItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  selectedPhotoIds?: string[];
  onToggleSelectPhoto?: (photoId: string) => void;
}

export function PhotoViewerModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  selectedPhotoIds = [],
  onToggleSelectPhoto,
}: PhotoViewerModalProps) {
  const currentPhoto = isOpen && currentIndex >= 0 ? photos[currentIndex] : undefined;
  const isCurrentSelected = currentPhoto ? selectedPhotoIds.includes(currentPhoto.id) : false;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [userRotation, setUserRotation] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Reset viewer state whenever the displayed photo changes. Adjusting state
  // during render (instead of inside an effect) avoids cascading renders and
  // the set-state-in-effect lint rule.
  const activePhotoId = currentPhoto?.id ?? null;
  const [viewedPhotoId, setViewedPhotoId] = useState<string | null>(activePhotoId);
  if (viewedPhotoId !== activePhotoId) {
    setViewedPhotoId(activePhotoId);
    setUserRotation(0);
    setZoomLevel(1);
    setImageUrl(null);
    setLoading(true);
    setError(false);
  }

  useEffect(() => {
    if (!isOpen || !currentPhoto) return;

    let isMounted = true;

    fetchPhotoPreviewBlob(currentPhoto.id)
      .then((url) => {
        if (isMounted) {
          setImageUrl(url);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        console.error("Error fetching photo blob in viewer:", err);
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
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setUserRotation((prev) => (prev + 90) % 360);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !currentPhoto) return null;

  const initialRotation = currentPhoto.rotationAngle || 0;
  const totalRotation = (initialRotation + userRotation) % 360;

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

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `photo-${currentPhoto.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-2xl text-white select-none animate-in fade-in duration-200">
      <PhotoViewerControls
        currentPhoto={currentPhoto}
        currentIndex={currentIndex}
        totalPhotos={photos.length}
        isCurrentSelected={isCurrentSelected}
        onToggleSelectPhoto={onToggleSelectPhoto}
        onRotateCounterClockwise={() => setUserRotation((prev) => (prev - 90 + 360) % 360)}
        onRotateClockwise={() => setUserRotation((prev) => (prev + 90) % 360)}
        onZoomIn={() => setZoomLevel((prev) => Math.min(prev + 0.25, 3))}
        onZoomOut={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))}
        onResetZoom={() => {
          setZoomLevel(1);
          setUserRotation(0);
        }}
        zoomLevel={zoomLevel}
        onDownload={handleDownload}
        imageUrl={imageUrl}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onClose={onClose}
      />

      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-4 sm:p-8">
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 z-20 p-3 rounded-full bg-zinc-900/80 hover:bg-brand text-zinc-200 hover:text-white border border-zinc-700/80 shadow-xl backdrop-blur-md transition-all hover:scale-110"
          title="Previous Photo (←)"
        >
          <ChevronLeft className="size-6" />
        </button>

        <div className="relative w-full h-[75vh] flex items-center justify-center transition-all duration-200">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-10 text-brand animate-spin" />
              <span className="text-xs font-mono text-zinc-400">Loading full preview...</span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center gap-2 p-6 bg-zinc-900/90 rounded-2xl border border-red-500/30 text-center">
              <ImageOff className="size-10 text-red-400" />
              <span className="text-sm font-semibold text-red-400">Unable to load photo preview</span>
            </div>
          )}

          {imageUrl && !loading && !error && (
            <Image
              src={imageUrl}
              alt={`Photo ${currentPhoto.id}`}
              unoptimized
              fill
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{
                transform: `rotate(${totalRotation}deg) scale(${zoomLevel})`,
                objectFit: "contain",
              }}
              className="transition-transform duration-200 ease-out shadow-2xl rounded-lg pointer-events-none"
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 z-20 p-3 rounded-full bg-zinc-900/80 hover:bg-brand text-zinc-200 hover:text-white border border-zinc-700/80 shadow-xl backdrop-blur-md transition-all hover:scale-110"
          title="Next Photo (→)"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>

      <div className="p-3 bg-zinc-900/90 border-t border-zinc-800/80 backdrop-blur-md overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-2 max-w-fit mx-auto px-4">
          {photos.map((item, idx) => (
            <ThumbnailItem
              key={item.id}
              photo={item}
              isActive={idx === currentIndex}
              onClick={() => onNavigate(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

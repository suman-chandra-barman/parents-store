"use client";

import React from "react";
import { PhotoItem } from "../types/access-cards";
import {
  X,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Download,
  Check,
} from "lucide-react";

interface PhotoViewerControlsProps {
  currentPhoto: PhotoItem;
  currentIndex: number;
  totalPhotos: number;
  isCurrentSelected: boolean;
  onToggleSelectPhoto?: (photoId: string) => void;
  onRotateCounterClockwise: () => void;
  onRotateClockwise: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  zoomLevel: number;
  onDownload: () => void;
  imageUrl: string | null;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

export function PhotoViewerControls({
  currentPhoto,
  currentIndex,
  totalPhotos,
  isCurrentSelected,
  onToggleSelectPhoto,
  onRotateCounterClockwise,
  onRotateClockwise,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  zoomLevel,
  onDownload,
  imageUrl,
  toggleFullscreen,
  isFullscreen,
  onClose,
}: PhotoViewerControlsProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
          {currentIndex + 1} / {totalPhotos}
        </span>
        <div className="hidden sm:block">
          <h4 className="text-sm font-semibold text-zinc-100 truncate max-w-xs sm:max-w-md">
            {currentPhoto.album?.name || "Photo Details"}
          </h4>
          <p className="text-xs font-mono text-zinc-400 truncate">
            ID: {currentPhoto.id}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 bg-zinc-800/80 p-1 rounded-xl border border-zinc-700/60">
        {onToggleSelectPhoto && (
          <>
            <button
              type="button"
              onClick={() => onToggleSelectPhoto(currentPhoto.id)}
              title={isCurrentSelected ? "Deselect for order" : "Select for order"}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                isCurrentSelected
                  ? "bg-brand text-white font-semibold shadow-sm"
                  : "hover:bg-zinc-700 text-zinc-300 hover:text-white"
              }`}
            >
              <Check className="size-3.5" />
              <span>{isCurrentSelected ? "Selected for Order" : "Select Photo"}</span>
            </button>
            <div className="w-px h-5 bg-zinc-700 mx-1" />
          </>
        )}

        <button
          type="button"
          onClick={onRotateCounterClockwise}
          title="Rotate Left 90°"
          className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRotateClockwise}
          title="Rotate Right 90° (Key: R)"
          className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          <RotateCw className="size-4" />
        </button>
        <div className="w-px h-5 bg-zinc-700 mx-1" />
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoomLevel <= 0.5}
          title="Zoom Out"
          className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors disabled:opacity-40"
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          type="button"
          onClick={onResetZoom}
          title="Reset Zoom"
          className="px-2 py-1 rounded-lg text-xs font-mono hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoomLevel >= 3}
          title="Zoom In"
          className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors disabled:opacity-40"
        >
          <ZoomIn className="size-4" />
        </button>
        <div className="w-px h-5 bg-zinc-700 mx-1" />
        <button
          type="button"
          onClick={onDownload}
          disabled={!imageUrl}
          title="Download Image"
          className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors disabled:opacity-40"
        >
          <Download className="size-4" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors hidden sm:block"
        >
          {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-300 border border-zinc-700 transition-colors"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

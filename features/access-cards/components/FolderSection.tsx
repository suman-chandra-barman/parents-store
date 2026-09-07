"use client";

import React, { useState } from "react";
import { FolderItem, PhotoItem, ViewMode } from "../types/access-cards";
import { PhotoGrid } from "./PhotoGrid";
import { Folder, ChevronDown, ChevronUp, Lock, Images } from "lucide-react";

interface FolderSectionProps {
  folder: FolderItem;
  viewMode: ViewMode;
  onPhotoSelect: (photo: PhotoItem, globalIndex: number) => void;
  getGlobalIndex: (photoId: string) => number;
  selectedPhotoIds?: string[];
  onToggleSelectPhoto?: (photoId: string, e: React.MouseEvent) => void;
}

export function FolderSection({
  folder,
  viewMode,
  onPhotoSelect,
  getGlobalIndex,
  selectedPhotoIds = [],
  onToggleSelectPhoto,
}: FolderSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const albumName = folder.album?.name || "Access Folder";
  const photoCount = folder.photos?.length || 0;
  const password = folder.accessCard?.password;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-muted/40 border-b border-border/70 cursor-pointer hover:bg-muted/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand/10 text-brand border border-brand/20">
            <Folder className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>{albumName}</span>
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <Images className="size-3.5 text-brand" />
                {photoCount} {photoCount === 1 ? "Photo" : "Photos"}
              </span>
              {password && (
                <span className="flex items-center gap-1 font-mono text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                  <Lock className="size-3 text-amber-500" />
                  {password}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs font-medium text-muted-foreground">
            {isExpanded ? "Hide Photos" : "Show Photos"}
          </span>
          <div className="p-1 rounded-lg bg-muted text-foreground">
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6">
          <PhotoGrid
            photos={folder.photos}
            viewMode={viewMode}
            onSelectPhoto={(photo) => onPhotoSelect(photo, getGlobalIndex(photo.id))}
            selectedPhotoIds={selectedPhotoIds}
            onToggleSelectPhoto={onToggleSelectPhoto}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Check, Loader2, ImageIcon } from "lucide-react";
import { fetchPhotoPreviewBlob } from "@/features/access-cards/utils/access-cards-api";
import { cn } from "@/lib/utils";

interface PhotoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  photoIds: string[];
  selectedPhotoId?: string;
  onSelectPhoto: (photoId: string) => void;
}

export function PhotoSelectionModal({
  isOpen,
  onClose,
  title,
  photoIds,
  selectedPhotoId,
  onSelectPhoto,
}: PhotoSelectionModalProps) {
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen || photoIds.length === 0) return;

    let isMounted = true;
    photoIds.forEach((id) => {
      if (photoUrls[id]) return;

      setLoadingMap((prev) => ({ ...prev, [id]: true }));
      fetchPhotoPreviewBlob(id)
        .then((url) => {
          if (isMounted) {
            setPhotoUrls((prev) => ({ ...prev, [id]: url }));
            setLoadingMap((prev) => ({ ...prev, [id]: false }));
          }
        })
        .catch(() => {
          if (isMounted) {
            setLoadingMap((prev) => ({ ...prev, [id]: false }));
          }
        });
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, photoIds, photoUrls]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200 flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div>
            <h3 id="modal-title" className="text-base font-bold text-neutral-900">
              Select Photo for {title}
            </h3>
            <p className="text-xs text-neutral-500">
              Choose one of your favorite photos for this package slot
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body - Photos Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          {photoIds.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <ImageIcon className="size-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No photos available for this slot</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photoIds.map((id) => {
                const isSelected = selectedPhotoId === id;
                const url = photoUrls[id];
                const isLoading = loadingMap[id];

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onSelectPhoto(id);
                      onClose();
                    }}
                    className={cn(
                      "group relative aspect-3/4 rounded-xl overflow-hidden border-2 bg-neutral-100 transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary",
                      isSelected
                        ? "border-[#2060b0] ring-2 ring-[#2060b0]/30 shadow-md"
                        : "border-neutral-200 hover:border-neutral-400 hover:shadow-sm"
                    )}
                  >
                    {url ? (
                      <Image
                        src={url}
                        alt="Photo selection preview"
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-6 animate-spin text-neutral-400" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                        <ImageIcon className="size-8" />
                      </div>
                    )}

                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 size-6 rounded-full bg-[#2060b0] text-white flex items-center justify-center shadow-md">
                        <Check className="size-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] font-semibold text-white block truncate">
                        {isSelected ? "Selected" : "Click to select"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-neutral-200 bg-neutral-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAccessCardsGallery } from "../hooks/useAccessCardsGallery";
import { useFavorites } from "../hooks/useFavorites";
import { PhotoItem } from "../types/access-cards";
import { fetchPhotoPreviewBlob } from "../utils/access-cards-api";
import { PhotoDetailsPreview } from "./PhotoDetailsPreview";
import { FullscreenPhotoViewer } from "./FullscreenPhotoViewer";
import { useGetPaperFormatsQuery } from "@/features/paper-formats/api/paperFormatsApi";
import { PaperFormatsList } from "@/features/paper-formats/components/PaperFormatsList";

import { useTenantStore } from "@/stores/useTenantStore";

export interface PhotoDetailsViewProps {
  photoId: string;
}

export function PhotoDetailsView({ photoId }: PhotoDetailsViewProps) {
  const locale = useLocale();
  const tenant = useTenantStore((state) => state.tenant);
  const { galleryResponse, isLoading: isGalleryLoading } = useAccessCardsGallery();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const { data: formats = [], isLoading: isFormatsLoading } =
    useGetPaperFormatsQuery(undefined, {
      skip: !tenant?.id,
    });

  const [activePhotoId, setActivePhotoId] = useState<string>(photoId);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isBlobLoading, setIsBlobLoading] = useState<boolean>(true);
  const [blobError, setBlobError] = useState<boolean>(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);

  // Flatten all photos in gallery
  const allPhotos = useMemo(() => {
    const list: PhotoItem[] = [];
    const folders = galleryResponse?.data?.folders || [];
    const uncategorized = galleryResponse?.data?.uncategorized || [];

    folders.forEach((f) => {
      f.photos.forEach((p) => {
        list.push({ ...p, album: p.album || f.album });
      });
    });
    uncategorized.forEach((p) => {
      list.push(p);
    });

    return list;
  }, [galleryResponse]);

  // Current active photo object
  const currentIndex = useMemo(() => {
    const idx = allPhotos.findIndex((p) => p.id === activePhotoId);
    return idx >= 0 ? idx : 0;
  }, [allPhotos, activePhotoId]);

  const currentPhoto: PhotoItem | undefined = useMemo(() => {
    if (allPhotos.length > 0) {
      return allPhotos[currentIndex];
    }
    // Fallback stub if gallery not ready yet
    return { id: activePhotoId };
  }, [allPhotos, currentIndex, activePhotoId]);

  // Fetch image blob whenever activePhotoId changes
  useEffect(() => {
    if (!activePhotoId) return;

    let isMounted = true;

    fetchPhotoPreviewBlob(activePhotoId)
      .then((url) => {
        if (isMounted) {
          setBlobUrl(url);
          setIsBlobLoading(false);
          setBlobError(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load photo blob:", err);
        if (isMounted) {
          setBlobError(true);
          setIsBlobLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activePhotoId]);

  const handleNavigatePhoto = useCallback(
    (index: number) => {
      if (allPhotos[index]) {
        const nextId = allPhotos[index].id;
        setActivePhotoId(nextId);
        window.history.replaceState(
          null,
          "",
          `/${locale}/photo-galleries/access-cards/${nextId}`
        );
      }
    },
    [allPhotos, locale]
  );

  const photoTitle =
    currentPhoto?.album?.name ||
    `Photo ${activePhotoId ? activePhotoId.substring(0, 8).toUpperCase() : ""}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50/50 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/photo-galleries/access-cards`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Gallery</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <h1 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
              {photoTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Sparkles className="size-4 text-brand" />
            <span>Select a paper format to order custom prints</span>
          </div>
        </div>

        {/* Main Details Grid: Left Image Preview, Right Formats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photo Preview */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24">
            {currentPhoto && (
              <PhotoDetailsPreview
                photo={currentPhoto}
                photos={allPhotos.length > 0 ? allPhotos : [currentPhoto]}
                currentIndex={currentIndex}
                blobUrl={blobUrl}
                loading={isBlobLoading || isGalleryLoading}
                error={blobError}
                isFavorited={favoriteIds.includes(activePhotoId)}
                onToggleFavorite={toggleFavorite}
                onNavigate={handleNavigatePhoto}
                onOpenFullscreen={() => setIsFullscreenOpen(true)}
              />
            )}
          </div>

          {/* Right Column: Paper Formats */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs">
              <div className="mb-4">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                  Paper Formats & Products
                </h2>
                <p className="text-xs text-neutral-500">
                  Choose from available paper sizes, photo stickers, or prints.
                </p>
              </div>

              <PaperFormatsList
                formats={formats}
                photoId={activePhotoId}
                isLoading={isFormatsLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Viewer Modal */}
      {isFullscreenOpen && allPhotos.length > 0 && (
        <FullscreenPhotoViewer
          photos={allPhotos}
          currentIndex={currentIndex}
          isOpen={isFullscreenOpen}
          onClose={() => setIsFullscreenOpen(false)}
          onNavigate={(newIdx) => {
            handleNavigatePhoto(newIdx);
          }}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}

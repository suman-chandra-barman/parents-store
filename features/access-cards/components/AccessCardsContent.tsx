"use client";

import { useState, useMemo, useCallback } from "react";
import { PhotoItem } from "@/features/access-cards/types/access-cards";
import { useAccessCardsGallery } from "@/features/access-cards/hooks/useAccessCardsGallery";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";

import { HeroSection } from "@/features/access-cards/components/HeroSection";
import { AccessCardPhotoGrid } from "@/features/access-cards/components/AccessCardPhotoGrid";
import { FullscreenPhotoViewer } from "@/features/access-cards/components/FullscreenPhotoViewer";
import { useTenantStore } from "@/stores/useTenantStore";

function AccessCardsContent() {
  const tenant = useTenantStore(({tenant})=> tenant);

  const {
    isLoading,
    error,
    galleryResponse,
    handleAuthenticate,
  } = useAccessCardsGallery();

  const { favoriteIds, toggleFavorite } = useFavorites();
  const [accessCodes, setAccessCodes] = useState<string[]>([]);
  const [fullscreenIndex, setFullscreenIndex] = useState<number>(-1);

  const folders = useMemo(
    () => galleryResponse?.data?.folders || [],
    [galleryResponse]
  );
  const uncategorizedPhotos = useMemo(
    () => galleryResponse?.data?.uncategorized || [],
    [galleryResponse]
  );

  // Flatten all photos across folders and uncategorized into a single gallery list
  const allPhotos = useMemo(() => {
    const list: PhotoItem[] = [];
    folders.forEach((f) => {
      f.photos.forEach((p) => {
        list.push({ ...p, album: p.album || f.album });
      });
    });
    uncategorizedPhotos.forEach((p) => {
      list.push(p);
    });
    return list;
  }, [folders, uncategorizedPhotos]);

  const hasGalleryData = allPhotos.length > 0;

  const handleOpenFullscreen = useCallback((photo: PhotoItem, index: number) => {
    setFullscreenIndex(index);
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setFullscreenIndex(-1);
  }, []);

  const handleViewGallery = useCallback(
    async (codes: string[]) => {
      if (codes.length === 0) return;
      await handleAuthenticate(codes[0]);
      const el = document.getElementById("gallery-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [handleAuthenticate]
  );

  return (
    <div className="bg-background text-foreground transition-colors flex flex-col">
      {/* Hero Section */}
      <HeroSection
        title="Photo Gallery"
        subtitle={tenant?.name ?? "LUMIPHOTO"}
        accessCodes={accessCodes}
        onAccessCodesChange={setAccessCodes}
        isLoading={isLoading}
        error={error}
        onViewGallery={handleViewGallery}
      />

      {/* Unified Gallery Section */}
      {hasGalleryData && (
        <div id="gallery-section" className="flex-1 pb-24">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <AccessCardPhotoGrid
              photos={allPhotos}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onSelectPhoto={handleOpenFullscreen}
            />
          </main>
        </div>
      )}

      {/* Fullscreen Photo Viewer */}
      {fullscreenIndex >= 0 && (
        <FullscreenPhotoViewer
          photos={allPhotos}
          currentIndex={fullscreenIndex}
          isOpen={fullscreenIndex >= 0}
          onClose={handleCloseFullscreen}
          onNavigate={setFullscreenIndex}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}

export default AccessCardsContent;

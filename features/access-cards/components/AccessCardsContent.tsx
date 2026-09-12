"use client";

import { useState, useMemo, useCallback } from "react";
import { PhotoItem } from "@/features/access-cards/types/access-cards";
import { useAccessCardsGallery } from "@/features/access-cards/hooks/useAccessCardsGallery";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";

import { HeroSection } from "@/features/access-cards/components/HeroSection";
import { AccessCardPhotoGrid } from "@/features/access-cards/components/AccessCardPhotoGrid";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTenantStore } from "@/stores/useTenantStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AccessCardsContent() {
  const tenant = useTenantStore(({ tenant }) => tenant);

  const router = useRouter();
  const locale = useLocale();
  const { isLoading, error, galleryResponse, handleAuthenticate } =
    useAccessCardsGallery();

  const { favoriteIds, toggleFavorite } = useFavorites();
  const [accessCodes, setAccessCodes] = useState<string[]>([]);

  const folders = useMemo(
    () => galleryResponse?.data?.folders || [],
    [galleryResponse],
  );
  const uncategorizedPhotos = useMemo(
    () => galleryResponse?.data?.uncategorized || [],
    [galleryResponse],
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

  const handleSelectPhoto = useCallback(
    (photo: PhotoItem) => {
      router.push(`/${locale}/photo-galleries/access-cards/${photo.id}`);
    },
    [router, locale],
  );

  const handleViewGallery = useCallback(
    async (codes: string[]) => {
      if (codes.length === 0) return;
      await handleAuthenticate(codes[0]);
      const el = document.getElementById("gallery-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [handleAuthenticate],
  );

  return (
    <main className="bg-background text-foreground transition-colors flex flex-col">
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
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <AccessCardPhotoGrid
            photos={allPhotos}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onSelectPhoto={handleSelectPhoto}
          />
        </section>
      )}

      {favoriteIds.length > 0 && (
        <div className="flex justify-center mb-16 px-4">
          <Link
            href={`/${locale}/photo-galleries/packages`}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white bg-[#2060b0] hover:bg-[#1a4f94] shadow-md transition-all active:scale-98 text-sm sm:text-base cursor-pointer"
          >
            Continue with {favoriteIds.length} {favoriteIds.length === 1 ? "Favorite" : "Favorites"}
          </Link>
        </div>
      )}
    </main>
  );
}

export default AccessCardsContent;

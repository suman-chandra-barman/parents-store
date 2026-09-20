"use client";

import React, { useState, useCallback } from "react";
import { useRouter, notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Loader2, Images } from "lucide-react";
import { usePublicGallery } from "../hooks/usePublicGallery";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";
import { PhotoItem } from "../types/public-galleries";
import { PublicGalleryHero } from "./PublicGalleryHero";
import { PublicGalleryPasswordPrompt } from "./PublicGalleryPasswordPrompt";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { PhotoCardItem } from "@/features/access-cards/components/PhotoCardItem";
import { PhotoGridSkeleton } from "@/features/access-cards/components/PhotoGridSkeleton";
import { FullscreenPhotoViewer } from "@/features/access-cards/components/FullscreenPhotoViewer";

export function PublicGalleriesContent() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("PublicGalleries");

  const {
    jobId,
    isPasswordRequired,
    isCheckingPasswordStatus,
    isGalleryLoading,
    isPasswordVerified,
    photos,
    totalCount,
    error,
    submitPassword,
    refetch,
  } = usePublicGallery();

  const { favoriteIds, toggleFavorite } = useFavorites();
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const handleScrollToGallery = useCallback(() => {
    const el = document.getElementById("public-gallery-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSelectPhoto = useCallback(
    (photo: PhotoItem) => {
      router.push(`/${locale}/photo-galleries/classic/${photo.id}`);
    },
    [router, locale],
  );

  // 1. If no Job ID is provided in URL, trigger not-found 404 page
  if (!jobId) {
    notFound();
  }

  // 2. While checking password requirement status
  if (isCheckingPasswordStatus) {
    return (
      <div className="min-h-[calc(100vh-66px)] flex flex-col items-center justify-center p-8 bg-neutral-50/50 space-y-4">
        <Loader2 className="size-8 text-brand animate-spin" />
        <p className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
          Checking Gallery Access...
        </p>
      </div>
    );
  }

  // 3. Full-page error view if initial status check or gallery failed with no photos
  if (error && photos.length === 0) {
    return (
      <ErrorState
        variant="page"
        title="Unable to Load Photo Gallery"
        message="We couldn't retrieve the photos for this gallery. The link or Job ID may be invalid, expired, or temporarily unavailable."
        rawError={error}
        onRetry={refetch}
        retryText="Try Again"
        backHomeHref={`/${locale}`}
        backHomeText="Back to Home"
      />
    );
  }

  // 4. If password is required and gallery is not unlocked yet
  if (isPasswordRequired === true && !isPasswordVerified) {
    return (
      <PublicGalleryPasswordPrompt
        isLoading={isGalleryLoading}
        error={error}
        onSubmitPassword={submitPassword}
      />
    );
  }

  // 5. Open Gallery (Password not required or successfully verified)
  return (
    <main className="bg-background text-foreground transition-colors flex flex-col min-h-screen">
      {/* Public Gallery Hero */}
      <PublicGalleryHero
        totalPhotos={totalCount}
        onExploreClick={handleScrollToGallery}
      />

      {/* Gallery Section */}
      <section
        id="public-gallery-section"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
      >
        {/* Loading Gallery Photos State */}
        {isGalleryLoading ? (
          <div className="space-y-4">
            <PhotoGridSkeleton count={12} />
          </div>
        ) : photos.length === 0 ? (
          /* Standardized Empty State */
          <EmptyState
            icon={<Images className="size-8 stroke-[1.5]" />}
            title={t("noPhotosFound")}
            description={t("noPhotosDesc")}
          />
        ) : (
          /* Photo Masonry Grid */
          <div
            onContextMenu={(e) => e.preventDefault()}
            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 space-y-2 w-full select-none"
          >
            {photos.map((photo, index) => (
              <PhotoCardItem
                key={photo.id}
                photo={photo}
                index={index}
                isFavorited={favoriteIds.includes(photo.id)}
                onToggleFavorite={toggleFavorite}
                onSelect={handleSelectPhoto}
              />
            ))}
          </div>
        )}

        {/* Favorite Selection CTA */}
        {favoriteIds.length > 0 && (
          <div className="flex justify-center pt-8 pb-12">
            <Link
              href={`/${locale}/photo-galleries/packages`}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white bg-brand hover:opacity-90 shadow-md transition-all active:scale-98 text-sm sm:text-base cursor-pointer"
            >
              Continue with {favoriteIds.length}{" "}
              {favoriteIds.length === 1 ? "Favorite" : "Favorites"}
            </Link>
          </div>
        )}
      </section>

      {/* Lightbox / Fullscreen Viewer */}
      {fullscreenIndex !== null && photos.length > 0 && (
        <FullscreenPhotoViewer
          photos={photos}
          currentIndex={fullscreenIndex}
          isOpen={fullscreenIndex !== null}
          onClose={() => setFullscreenIndex(null)}
          onNavigate={(newIdx) => setFullscreenIndex(newIdx)}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </main>
  );
}

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { PhotoItem } from "@/features/access-cards/types/access-cards";
import { useAccessCardsGallery } from "@/features/access-cards/hooks/useAccessCardsGallery";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";
import { AccessCodeLoginCard } from "./AccessCodeLoginCard";
import { GalleryFilterBar, type DynamicAlbumFilter } from "./GalleryFilterBar";
import { GalleryPhotoCard } from "./GalleryPhotoCard";
import { GalleryStickyBottomBar } from "./GalleryStickyBottomBar";
import { TwoFactorAuthModal } from "./TwoFactorAuthModal";
import { parseErrorMessage } from "@/utils/parseErrorMessage";
import { toast } from "sonner";

const ALBUM_PALETTES = [
  { dotColor: "#FF5A36", activeBgColor: "#FFF2EE" },
  { dotColor: "#10B981", activeBgColor: "#ECFDF5" },
  { dotColor: "#3B82F6", activeBgColor: "#EFF6FF" },
  { dotColor: "#8B5CF6", activeBgColor: "#F5F3FF" },
  { dotColor: "#F59E0B", activeBgColor: "#FFFBEB" },
  { dotColor: "#EC4899", activeBgColor: "#FDF2F8" },
  { dotColor: "#06B6D4", activeBgColor: "#ECFEFF" },
];

export function AccessCardsContent() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const {
    isLoading,
    isChecking2FA,
    error,
    galleryResponse,
    check2FAStatus,
    verify2FAPassword,
    handleAuthenticate,
    isAuthenticated,
  } = useAccessCardsGallery();

  const { favoriteIds, toggleFavorite } = useFavorites();
  const [twoFactorModalCode, setTwoFactorModalCode] = useState<string | null>(null);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [albumFilter, setAlbumFilter] = useState<string>("ALL");
  const [hasEnteredGallery, setHasEnteredGallery] = useState(false);

  // Derived state: calculate directly during render to avoid cascading renders
  const isViewingGallery =
    isAuthenticated ||
    searchParams?.get("view") === "gallery" ||
    hasEnteredGallery;

  const folders = useMemo(
    () => galleryResponse?.data?.folders || [],
    [galleryResponse],
  );
  const uncategorizedPhotos = useMemo(
    () => galleryResponse?.data?.uncategorized || [],
    [galleryResponse],
  );

  // Flatten all real API photos
  const allPhotos = useMemo(() => {
    const list: (PhotoItem & {
      albumName: string;
      albumFilterId: string;
      dotColor: string;
    })[] = [];

    folders.forEach((folder, folderIdx) => {
      const albumName = folder.album?.name || `Album ${folderIdx + 1}`;
      const filterId = folder.albumId || folder.id || albumName;
      const palette = ALBUM_PALETTES[folderIdx % ALBUM_PALETTES.length];

      folder.photos?.forEach((photo) => {
        list.push({
          ...photo,
          albumId: photo.albumId || folder.albumId,
          album: photo.album || folder.album || { name: albumName },
          albumName,
          albumFilterId: filterId,
          dotColor: palette.dotColor,
        });
      });
    });

    if (uncategorizedPhotos.length > 0) {
      const uncatPalette = ALBUM_PALETTES[folders.length % ALBUM_PALETTES.length];
      uncategorizedPhotos.forEach((photo) => {
        list.push({
          ...photo,
          albumName: photo.album?.name || "Uncategorized",
          albumFilterId: "uncategorized",
          dotColor: uncatPalette.dotColor,
        });
      });
    }

    return list;
  }, [folders, uncategorizedPhotos]);

  // Extract dynamic album filter tabs
  const albumTabs = useMemo(() => {
    const tabs: DynamicAlbumFilter[] = [];

    folders.forEach((folder, folderIdx) => {
      const name = folder.album?.name || `Album ${folderIdx + 1}`;
      const id = folder.albumId || folder.id || name;
      const count = folder.photos?.length || 0;
      const thumbnailPhotoId = folder.photos?.[0]?.id;
      const palette = ALBUM_PALETTES[folderIdx % ALBUM_PALETTES.length];

      tabs.push({
        id,
        name,
        count,
        thumbnailPhotoId,
        dotColor: palette.dotColor,
        activeBgColor: palette.activeBgColor,
      });
    });

    if (uncategorizedPhotos.length > 0) {
      const palette = ALBUM_PALETTES[folders.length % ALBUM_PALETTES.length];
      tabs.push({
        id: "uncategorized",
        name: "Uncategorized",
        count: uncategorizedPhotos.length,
        thumbnailPhotoId: uncategorizedPhotos[0]?.id,
        dotColor: palette.dotColor,
        activeBgColor: palette.activeBgColor,
      });
    }

    return tabs;
  }, [folders, uncategorizedPhotos]);

  // Filtered photos based on active album filter
  const displayedPhotos = useMemo(() => {
    if (albumFilter === "ALL") return allPhotos;
    return allPhotos.filter(
      (p) => p.albumFilterId === albumFilter || p.albumName === albumFilter,
    );
  }, [allPhotos, albumFilter]);

  const initialCode =
    searchParams?.get("code") ||
    searchParams?.get("password") ||
    searchParams?.get("passwords") ||
    "";

  const handleLoginSubmit = useCallback(
    async (codes: string[]) => {
      if (codes.length === 0) return;
      setAuthError(null);
      const primaryCode = codes[0];

      try {
        const statusData = await check2FAStatus(primaryCode);
        if (statusData?.isTwoFactorProtected) {
          setTwoFactorModalCode(primaryCode);
        } else {
          try {
            await handleAuthenticate(codes.join(","));
          } catch (err) {
            console.error("Auth note:", err);
          }
          setHasEnteredGallery(true);
          router.replace(`/${locale}/photo-galleries/access-cards?view=gallery`);
        }
      } catch (err: unknown) {
        setAuthError(
          parseErrorMessage(
            err,
            "Failed to check access card status. Please check your code.",
          ),
        );
      }
    },
    [check2FAStatus, handleAuthenticate, locale, router],
  );

  const handleVerify2FASubmit = useCallback(
    async (twoFactorPassword: string): Promise<boolean> => {
      if (!twoFactorModalCode) return false;
      setIsVerifying2FA(true);
      try {
        const isMatch = await verify2FAPassword(
          twoFactorModalCode,
          twoFactorPassword,
        );
        if (isMatch) {
          const formattedPassword = `${twoFactorModalCode}:${twoFactorPassword.trim()}`;
          await handleAuthenticate(formattedPassword);
          setTwoFactorModalCode(null);
          setHasEnteredGallery(true);
          router.replace(`/${locale}/photo-galleries/access-cards?view=gallery`);
          return true;
        }
        return false;
      } catch (err: unknown) {
        toast.error(parseErrorMessage(err, "Failed to verify 2FA password."));
        return false;
      } finally {
        setIsVerifying2FA(false);
      }
    },
    [twoFactorModalCode, verify2FAPassword, handleAuthenticate, locale, router],
  );

  const handleSelectPhoto = useCallback(
    (photo: PhotoItem) => {
      router.push(`/${locale}/photo-galleries/access-cards/${photo.id}`);
    },
    [router, locale],
  );

  // STEP 1: If not viewing gallery, render Login Card
  if (!isViewingGallery) {
    return (
      <main className="min-h-[calc(100vh-140px)] flex flex-col justify-center bg-[#FAF9F5]">
        <AccessCodeLoginCard
          initialCode={initialCode}
          isLoading={isLoading || isChecking2FA}
          error={error || authError}
          onSubmit={handleLoginSubmit}
        />

        {twoFactorModalCode && (
          <TwoFactorAuthModal
            isOpen={Boolean(twoFactorModalCode)}
            accessCode={twoFactorModalCode}
            onClose={() => setTwoFactorModalCode(null)}
            onVerify={handleVerify2FASubmit}
            isLoading={isVerifying2FA}
          />
        )}
      </main>
    );
  }

  // STEP 2: Explore Gallery
  return (
    <main className="min-h-screen bg-[#FAF9F5] pb-28 pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Filter & Subheader */}
        <GalleryFilterBar
          selectedFilter={albumFilter}
          onFilterChange={setAlbumFilter}
          albums={albumTabs}
          totalPhotosCount={allPhotos.length}
        />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full aspect-3/4 rounded-3xl bg-neutral-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State: Only show after data has truly loaded from server and has 0 photos */}
        {!isLoading && Boolean(galleryResponse) && allPhotos.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
            <p className="text-neutral-500 font-medium text-base">
              No photos found in this gallery.
            </p>
          </div>
        )}

        {/* 3-Column Gallery Grid */}
        {!isLoading && allPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPhotos.map((photo) => (
              <GalleryPhotoCard
                key={photo.id}
                photo={photo}
                albumName={photo.albumName}
                dotColor={photo.dotColor}
                isFavorited={favoriteIds.includes(photo.id)}
                onToggleFavorite={toggleFavorite}
                onSelect={handleSelectPhoto}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <GalleryStickyBottomBar favoriteCount={favoriteIds.length} />

      {/* 2FA Verification Modal */}
      {twoFactorModalCode && (
        <TwoFactorAuthModal
          isOpen={Boolean(twoFactorModalCode)}
          accessCode={twoFactorModalCode}
          onClose={() => setTwoFactorModalCode(null)}
          onVerify={handleVerify2FASubmit}
          isLoading={isVerifying2FA}
        />
      )}
    </main>
  );
}

export default AccessCardsContent;

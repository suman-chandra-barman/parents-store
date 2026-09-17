"use client";

import { useState, useMemo, useCallback } from "react";
import { PhotoItem } from "@/features/access-cards/types/access-cards";
import { useAccessCardsGallery } from "@/features/access-cards/hooks/useAccessCardsGallery";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";

import { HeroSection } from "@/features/access-cards/components/HeroSection";
import { AccessCardPhotoGrid } from "@/features/access-cards/components/AccessCardPhotoGrid";
import { TwoFactorAuthModal } from "@/features/access-cards/components/TwoFactorAuthModal";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTenantStore } from "@/stores/useTenantStore";
import { parseErrorMessage } from "@/utils/parseErrorMessage";
import { toast } from "sonner";
import Link from "next/link";

function AccessCardsContent() {
  const tenant = useTenantStore(({ tenant }) => tenant);

  const router = useRouter();
  const locale = useLocale();
  const {
    isLoading,
    isChecking2FA,
    error,
    galleryResponse,
    check2FAStatus,
    verify2FAPassword,
    handleAuthenticate,
  } = useAccessCardsGallery();

  const { favoriteIds, toggleFavorite } = useFavorites();
  const [accessCodes, setAccessCodes] = useState<string[]>([]);
  const [twoFactorModalCode, setTwoFactorModalCode] = useState<string | null>(null);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

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
      setHeroError(null);
      const code = codes[0];

      try {
        const is2FA = await check2FAStatus(code);
        if (is2FA) {
          setTwoFactorModalCode(code);
        } else {
          await handleAuthenticate(code);
          setTimeout(() => {
            const el = document.getElementById("gallery-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } catch (err: unknown) {
        setHeroError(
          parseErrorMessage(err, "Failed to check access card status. Please try again."),
        );
      }
    },
    [check2FAStatus, handleAuthenticate],
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
          setTimeout(() => {
            const el = document.getElementById("gallery-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 100);
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
    [twoFactorModalCode, verify2FAPassword, handleAuthenticate],
  );

  return (
    <main className="bg-background text-foreground transition-colors flex flex-col">
      {/* Hero Section */}
      <HeroSection
        title="Photo Gallery"
        subtitle={tenant?.name ?? "LUMIPHOTO"}
        accessCodes={accessCodes}
        onAccessCodesChange={setAccessCodes}
        isLoading={isLoading || isChecking2FA}
        error={error || heroError}
        onViewGallery={handleViewGallery}
      />

      {/* Unified Gallery Section */}
      {hasGalleryData && (
        <section
          id="gallery-section"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
        >
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
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white bg-brand hover:opacity-90 shadow-md transition-all active:scale-98 text-sm sm:text-base cursor-pointer"
          >
            Continue with {favoriteIds.length} {favoriteIds.length === 1 ? "Favorite" : "Favorites"}
          </Link>
        </div>
      )}

      {/* 2FA Verification Modal */}
      {twoFactorModalCode && (
        <TwoFactorAuthModal
          key={twoFactorModalCode}
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

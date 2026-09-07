"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  FolderItem,
  PhotoItem,
  ViewMode,
} from "@/features/access-cards/types/access-cards";
import { useAccessCardsGallery } from "@/features/access-cards/hooks/useAccessCardsGallery";

import { HeroSection } from "@/features/access-cards/components/HeroSection";
import { FolderSection } from "@/features/access-cards/components/FolderSection";
import { PhotoGrid } from "@/features/access-cards/components/PhotoGrid";
import { PhotoViewerModal } from "@/features/access-cards/components/PhotoViewerModal";
import { CreateOrderModal } from "@/features/orders/components/CreateOrderModal";
import { OrderSuccessModal } from "@/features/orders/components/OrderSuccessModal";
import { OrderCreatedData } from "@/features/orders/types/orders";
import { AlertCircle, Images, Layers, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function AccessCardsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const viewMode = (searchParams.get("view") as ViewMode) || "grid";

  const updateUrlParams = useCallback(
    (newQuery: string, newViewMode: ViewMode) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newQuery.trim()) {
        params.set("q", newQuery.trim());
      } else {
        params.delete("q");
      }
      if (newViewMode && newViewMode !== "grid") {
        params.set("view", newViewMode);
      } else {
        params.delete("view");
      }
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const {
    isLoading,
    error,
    galleryResponse,
    handleAuthenticate,
  } = useAccessCardsGallery();

  // Multi access-card codes state — starts empty, no default
  const [accessCodes, setAccessCodes] = useState<string[]>([]);

  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [createdOrderData, setCreatedOrderData] =
    useState<OrderCreatedData | null>(null);

  const handleToggleSelectPhoto = useCallback((photoId: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId],
    );
  }, []);

  const folders = useMemo(
    () => galleryResponse?.data?.folders || [],
    [galleryResponse],
  );
  const uncategorizedPhotos = useMemo(
    () => galleryResponse?.data?.uncategorized || [],
    [galleryResponse],
  );

  const totalPhotosCount =
    folders.reduce((acc, f) => acc + (f.photos?.length || 0), 0) +
    uncategorizedPhotos.length;
  const hasGalleryData = totalPhotosCount > 0;

  const activePriceListId = useMemo(() => {
    return (
      folders[0]?.album?.individualPriceListId ||
      folders[0]?.album?.groupPriceListId ||
      uncategorizedPhotos[0]?.album?.individualPriceListId ||
      uncategorizedPhotos[0]?.album?.groupPriceListId
    );
  }, [folders, uncategorizedPhotos]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    const q = searchQuery.toLowerCase().trim();
    return folders
      .map((folder) => {
        const matchesFolder =
          folder.album?.name?.toLowerCase().includes(q) ||
          folder.id?.toLowerCase().includes(q) ||
          folder.albumId?.toLowerCase().includes(q);

        const matchingPhotos = folder.photos.filter(
          (p) =>
            matchesFolder ||
            p.id.toLowerCase().includes(q) ||
            p.album?.name?.toLowerCase().includes(q),
        );

        if (matchesFolder || matchingPhotos.length > 0) {
          return { ...folder, photos: matchingPhotos };
        }
        return null;
      })
      .filter((f): f is FolderItem => f !== null);
  }, [folders, searchQuery]);

  const filteredUncategorized = useMemo(() => {
    if (!searchQuery.trim()) return uncategorizedPhotos;
    const q = searchQuery.toLowerCase().trim();
    return uncategorizedPhotos.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.album?.name?.toLowerCase().includes(q) ||
        p.albumId?.toLowerCase().includes(q),
    );
  }, [uncategorizedPhotos, searchQuery]);

  const allVisiblePhotos = useMemo(() => {
    const list: PhotoItem[] = [];
    filteredFolders.forEach((f) => {
      f.photos.forEach((p) => {
        list.push({ ...p, album: p.album || f.album });
      });
    });
    filteredUncategorized.forEach((p) => {
      list.push(p);
    });
    return list;
  }, [filteredFolders, filteredUncategorized]);

  const getGlobalIndex = useCallback(
    (photoId: string) => allVisiblePhotos.findIndex((p) => p.id === photoId),
    [allVisiblePhotos],
  );

  const handleOpenLightbox = (photo: PhotoItem, index: number) => {
    const globalIdx = getGlobalIndex(photo.id);
    setLightboxIndex(globalIdx !== -1 ? globalIdx : index);
  };

  /**
   * When user clicks VIEW GALLERY in the hero section.
   * Authenticate with the first code (API only supports one password at a time).
   * The HeroSection already handles multiple tag display.
   */
  const handleViewGallery = useCallback(
    async (codes: string[]) => {
      if (codes.length === 0) return;
      // Use the first code to authenticate (API limitation); UI still shows all tags
      await handleAuthenticate(codes[0]);
      // Scroll to gallery section after auth attempt
      const el = document.getElementById("gallery-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [handleAuthenticate],
  );

  return (
    <div className="bg-background text-foreground transition-colors flex flex-col">
      {/* Hero Section — always visible */}
      <HeroSection
        title="Photo Gallery"
        subtitle="LUMIPHOTO"
        accessCodes={accessCodes}
        onAccessCodesChange={setAccessCodes}
        isLoading={isLoading}
        error={error}
        onViewGallery={handleViewGallery}
      />

      {/* Gallery Section — only shown once data is loaded */}
      {hasGalleryData && (
        <div id="gallery-section" className="flex-1 pb-24">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            <h2 className="font-bold text-lg md:text-xl uppercase">
              Photographs
            </h2>
            {/* Folder Sections */}
            {filteredFolders.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-foreground">
                    <Layers className="size-5 text-brand" />
                    Album Folders ({filteredFolders.length})
                  </h2>
                </div>
                <div className="space-y-6">
                  {filteredFolders.map((folder) => (
                    <FolderSection
                      key={folder.id}
                      folder={folder}
                      viewMode={viewMode}
                      onPhotoSelect={handleOpenLightbox}
                      getGlobalIndex={getGlobalIndex}
                      selectedPhotoIds={selectedPhotoIds}
                      onToggleSelectPhoto={handleToggleSelectPhoto}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Uncategorized Photos */}
            {filteredUncategorized.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-foreground">
                    <Images className="size-5 text-brand" />
                    Uncategorized Photos ({filteredUncategorized.length})
                  </h2>
                </div>
                <PhotoGrid
                  photos={filteredUncategorized}
                  viewMode={viewMode}
                  onSelectPhoto={handleOpenLightbox}
                  selectedPhotoIds={selectedPhotoIds}
                  onToggleSelectPhoto={handleToggleSelectPhoto}
                />
              </section>
            )}

            {/* Empty search state */}
            {filteredFolders.length === 0 &&
              filteredUncategorized.length === 0 &&
              searchQuery && (
                <div className="flex flex-col items-center justify-center p-16 text-center bg-card rounded-3xl border border-border shadow-sm">
                  <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                    <AlertCircle className="size-8" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    No matching photos found
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    We couldn&apos;t find any photos or folders matching &quot;
                    {searchQuery}&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => updateUrlParams("", viewMode)}
                    className="mt-5 px-4 py-2 bg-brand hover:bg-brand/90 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Clear Search Query
                  </button>
                </div>
              )}
          </main>
        </div>
      )}

      {/* Floating Selection Bar */}
      {selectedPhotoIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card/95 backdrop-blur-xl border border-brand/40 shadow-2xl rounded-2xl px-5 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2 text-xs">
            <span className="size-2.5 rounded-full bg-brand animate-pulse" />
            <span className="font-semibold text-foreground">
              {selectedPhotoIds.length}{" "}
              {selectedPhotoIds.length === 1 ? "Photo" : "Photos"} Selected
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <button
            type="button"
            onClick={() => setSelectedPhotoIds([])}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="size-3.5" /> Clear
          </button>
          <Button
            variant="brand"
            size="sm"
            onClick={() => setIsOrderModalOpen(true)}
            className="rounded-xl font-semibold text-xs px-4 shadow-md gap-1.5"
          >
            <ShoppingBag className="size-4" />
            Create Order
          </Button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <PhotoViewerModal
          photos={allVisiblePhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex >= 0}
          onClose={() => setLightboxIndex(-1)}
          onNavigate={setLightboxIndex}
          selectedPhotoIds={selectedPhotoIds}
          onToggleSelectPhoto={handleToggleSelectPhoto}
        />
      )}

      {/* Order Modals */}
      <CreateOrderModal
        open={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedPhotoIds={
          selectedPhotoIds.length > 0
            ? selectedPhotoIds
            : allVisiblePhotos.map((p) => p.id)
        }
        priceListId={activePriceListId}
        onOrderCreated={(orderData) => {
          setIsOrderModalOpen(false);
          setCreatedOrderData(orderData);
          setSelectedPhotoIds([]);
        }}
      />
      <OrderSuccessModal
        open={!!createdOrderData}
        orderData={createdOrderData}
        onClose={() => setCreatedOrderData(null)}
      />
    </div>
  );
}

export default AccessCardsContent;

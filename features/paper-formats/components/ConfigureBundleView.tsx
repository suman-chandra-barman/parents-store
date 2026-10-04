"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { CheckCircle2, Pencil, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";
import { useCart } from "@/features/cart/hooks/useCart";
import { SAMPLE_GALLERY_PHOTOS } from "@/features/access-cards/utils/sampleGalleryData";
import { toast } from "sonner";

export interface ConfigureBundleViewProps {
  onBack: () => void;
  formatId?: string;
}

interface BundleSlot {
  id: string;
  name: string;
  type: string;
  photoId: string | null;
  photoUrl: string | null;
}

export function ConfigureBundleView({
  onBack,
  formatId = "savings-bundle",
}: ConfigureBundleViewProps) {
  const router = useRouter();
  const locale = useLocale();
  const { favoriteIds } = useFavorites();
  const { addToCart, isAdding } = useCart();

  const [activeChildTab, setActiveChildTab] = useState<"Emma" | "Noah">("Emma");
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(2);

  // 6 slots matching Image 4
  const [slots, setSlots] = useState<BundleSlot[]>([
    {
      id: "slot-1",
      name: "Poster (1x)",
      type: "Poster",
      photoId: "emma-photo-1",
      photoUrl:
        "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "slot-2",
      name: "Print 10x15",
      type: "Print",
      photoId: "emma-photo-2",
      photoUrl:
        "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "slot-3",
      name: "Print 10x15",
      type: "Print",
      photoId: "emma-photo-3",
      photoUrl:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "slot-4",
      name: "Print 10x15",
      type: "Print",
      photoId: "noah-photo-1",
      photoUrl:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "slot-5",
      name: "Digital 1",
      type: "Digital",
      photoId: null,
      photoUrl: null,
    },
    {
      id: "slot-6",
      name: "Digital 2",
      type: "Digital",
      photoId: null,
      photoUrl: null,
    },
  ]);

  const filledCount = useMemo(
    () => slots.filter((s) => s.photoId !== null).length,
    [slots],
  );
  const remainingSlots = slots.length - filledCount;

  // Selected photo IDs across all slots
  const assignedPhotoIds = useMemo(
    () => slots.map((s) => s.photoId).filter(Boolean) as string[],
    [slots],
  );

  // Available favorite photos filtered by active child
  const trayPhotos = useMemo(() => {
    return SAMPLE_GALLERY_PHOTOS.filter((p) => p.childName === activeChildTab);
  }, [activeChildTab]);

  const handleSelectPhotoForSlot = (photo: (typeof SAMPLE_GALLERY_PHOTOS)[0]) => {
    if (selectedSlotIndex === null) {
      // Find first empty slot
      const emptyIdx = slots.findIndex((s) => s.photoId === null);
      const targetIdx = emptyIdx !== -1 ? emptyIdx : 0;
      updateSlot(targetIdx, photo);
      return;
    }

    updateSlot(selectedSlotIndex, photo);
  };

  const updateSlot = (
    index: number,
    photo: (typeof SAMPLE_GALLERY_PHOTOS)[0],
  ) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        photoId: photo.id,
        photoUrl: photo.previewUrl,
      };
      return next;
    });

    // Auto-advance to next empty slot if any
    const nextEmpty = slots.findIndex((s, idx) => idx !== index && s.photoId === null);
    if (nextEmpty !== -1) {
      setSelectedSlotIndex(nextEmpty);
    } else {
      setSelectedSlotIndex(null);
    }
  };

  const handleContinue = async () => {
    const validPhotoIds = slots.map((s) => s.photoId).filter(Boolean) as string[];

    try {
      await addToCart({
        kind: "PHOTO",
        formatId: formatId || "savings-bundle",
        quantity: 1,
        photoIds: validPhotoIds,
      });
      router.push(`/${locale}/checkout`);
    } catch {
      router.push(`/${locale}/checkout`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Packages</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: Bundle Slots ── */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                Configure Savings Bundle
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                1× Poster, 3× Prints, 2× Digital
              </p>
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 w-fit">
              {filledCount} of {slots.length} slots filled
            </div>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {slots.map((slot, index) => {
              const isSelected = selectedSlotIndex === index;
              const hasPhoto = Boolean(slot.photoUrl);

              if (hasPhoto) {
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotIndex(index)}
                    className={`bg-white rounded-3xl border p-3 shadow-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#FF5A36] ring-2 ring-[#FF5A36]/15"
                        : "border-neutral-200/80 hover:border-neutral-300"
                    }`}
                  >
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100">
                      <Image
                        src={slot.photoUrl!}
                        alt={slot.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                    <div className="mt-2.5 text-center space-y-1">
                      <div className="text-xs font-bold text-neutral-800">
                        {slot.name}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSlotIndex(index);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 cursor-pointer"
                      >
                        <Pencil className="size-3" />
                        <span>Change</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // Empty Slot (Dashed Card)
              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlotIndex(index)}
                  className={`aspect-4/3 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#FF5A36] bg-[#FFF2EE]"
                      : "border-[#FF5A36]/60 bg-[#FFF8F6] hover:bg-[#FFF2EE]"
                  }`}
                >
                  <div className="size-8 rounded-full bg-white flex items-center justify-center text-[#FF5A36] shadow-2xs mb-2">
                    <Plus className="size-4 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-[#FF5A36]">
                    Add {slot.type}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium mt-0.5">
                    {slot.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Favorites Tray ── */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-xs space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
            <h3 className="text-base font-extrabold text-neutral-900">
              Favorites Tray
            </h3>

            {/* Child filter tabs */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveChildTab("Emma")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeChildTab === "Emma"
                    ? "bg-[#FFF2EE] text-[#FF5A36] shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                Emma
              </button>
              <button
                type="button"
                onClick={() => setActiveChildTab("Noah")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeChildTab === "Noah"
                    ? "bg-emerald-50 text-emerald-600 shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                Noah
              </button>
            </div>
          </div>

          {/* Grid of Tray Photos */}
          <div className="grid grid-cols-3 gap-3">
            {trayPhotos.map((photo) => {
              const isAssigned = assignedPhotoIds.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  onClick={() => handleSelectPhotoForSlot(photo)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                    isAssigned
                      ? "border-emerald-400 ring-2 ring-emerald-400/20"
                      : "border-neutral-200/80 hover:border-neutral-400 hover:scale-102"
                  }`}
                >
                  <Image
                    src={photo.previewUrl}
                    alt={photo.childName}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />

                  {/* Green Checkmark Badge if photo is placed */}
                  {isAssigned && (
                    <div className="absolute top-1.5 right-1.5 z-10 size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="size-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Continue Action */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={isAdding}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              remainingSlots === 0
                ? "bg-[#FF5A36] hover:bg-[#E84A26] text-white shadow-md shadow-[#FF5A36]/25"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
            }`}
          >
            {isAdding ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : null}
            <span>
              {remainingSlots === 0
                ? "Continue to Checkout"
                : `Continue (${remainingSlots} Slots Left)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/features/cart/hooks/useCart";
import { useFilterPhotosByFormatQuery } from "../api/paperFormatsApi";
import {
  PackageCustomizationFormData,
  PackageCustomizationFormSchema,
} from "../schemas/package-schemas";
import { PackageSlotItem, PaperFormatItem } from "../types/paper-formats";
import { PackageSlotCard } from "./PackageSlotCard";
import { PhotoSelectionModal } from "./PhotoSelectionModal";
import { cn } from "@/lib/utils";

import { useTenantStore } from "@/stores/useTenantStore";

interface PackageCustomizerViewProps {
  packageItem: PaperFormatItem;
  favoriteIds: string[];
  onBack: () => void;
}

export function PackageCustomizerView({
  packageItem,
  favoriteIds,
  onBack,
}: PackageCustomizerViewProps) {
  const tenant = useTenantStore((state) => state.tenant);
  const { addToCart, isAdding } = useCart();
  const [activeModalState, setActiveModalState] = useState<{
    slot: PackageSlotItem;
    index: number;
  } | null>(null);

  // Fetch filtered photos valid for this format
  const { data: eligiblePhotoIds = [] } = useFilterPhotosByFormatQuery(
    {
      formatId: packageItem.id,
      photoIds: favoriteIds,
    },
    {
      skip: !packageItem.id || favoriteIds.length === 0 || !tenant?.id,
    },
  );

  // Derive slots from format.packages or create default slot if none specified
  const slots: PackageSlotItem[] = useMemo(() => {
    if (packageItem.packages && packageItem.packages.length > 0) {
      return packageItem.packages;
    }
    return [
      {
        id: "default-slot",
        title: packageItem.title || "Photo",
        kind: "SINGLE_PHOTO",
        maxQuantity: 1,
      },
    ];
  }, [packageItem]);

  // Determine initial slot selections (all empty placeholders by default)
  const defaultSlotSelections = useMemo(() => {
    const initial: Record<string, string[]> = {};
    slots.forEach((slot) => {
      const maxCount = Math.max(1, slot.maxQuantity || 1);
      initial[slot.id] = Array.from({ length: maxCount }).map(() => "");
    });
    return initial;
  }, [slots]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PackageCustomizationFormData>({
    resolver: zodResolver(PackageCustomizationFormSchema),
    defaultValues: {
      formatId: packageItem.id,
      slotSelections: defaultSlotSelections,
    },
  });

  // Keep form values in sync when slots or default selections load
  useEffect(() => {
    setValue("formatId", packageItem.id);
    if (Object.keys(defaultSlotSelections).length > 0) {
      setValue("slotSelections", defaultSlotSelections);
    }
  }, [packageItem.id, defaultSlotSelections, setValue]);

  const watchedSlotSelections = watch("slotSelections") || {};

  // Pricing calculations
  const priceObj =
    packageItem.prices?.find((p) => p.isDefault) || packageItem.prices?.[0];
  const basePrice = priceObj
    ? parseFloat(priceObj.price) || 0
    : parseFloat(packageItem.oneOffCost || "0") || 12.99;
  const formattedTotalPrice = `€${basePrice.toFixed(2)}`;

  const onSubmit = async (data: PackageCustomizationFormData) => {
    // Collect all selected photo IDs across slots
    const allSelectedPhotoIds: string[] = [];
    slots.forEach((slot) => {
      const selected = data.slotSelections[slot.id] || [];
      selected.forEach((id) => {
        if (id && !allSelectedPhotoIds.includes(id)) {
          allSelectedPhotoIds.push(id);
        }
      });
    });

    if (allSelectedPhotoIds.length === 0) {
      toast.error("Please select at least one photo for the package slots");
      return;
    }

    try {
      await addToCart({
        kind: "PHOTO",
        formatId: packageItem.id,
        quantity: 1,
        photoIds: allSelectedPhotoIds,
      });
    } catch {
      // Error toast already handled by CartContext
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Packages</span>
      </button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Package Summary Card */}
          <div className="lg:col-span-4 xl:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  {packageItem.title}
                </h2>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Package
                </span>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-neutral-900 tracking-tight">
                  {formattedTotalPrice}
                </span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                VAT Included, postage calculated at checkout.
              </p>

              <button
                type="submit"
                disabled={isAdding}
                className={cn(
                  "w-full py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer",
                  "bg-[#2060b0] hover:bg-[#1a4f94] active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed",
                )}
              >
                {isAdding ? (
                  <Loader2 className="size-4 animate-spin text-white" />
                ) : (
                  <ShoppingBag className="size-4" />
                )}
                <span>Add to cart {formattedTotalPrice}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Slot Groups */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6">
            {slots.map((slot) => {
              const currentSelections = watchedSlotSelections[slot.id] || [];
              const slotError = errors.slotSelections?.[slot.id]?.message as
                | string
                | undefined;

              return (
                <PackageSlotCard
                  key={slot.id}
                  slot={slot}
                  selectedPhotoIds={currentSelections}
                  onSelectPlaceholder={(idx) =>
                    setActiveModalState({ slot, index: idx })
                  }
                  error={slotError}
                />
              );
            })}
          </div>
        </div>
      </form>

      {/* Photo Selection Modal */}
      {activeModalState && (
        <PhotoSelectionModal
          isOpen={Boolean(activeModalState)}
          onClose={() => setActiveModalState(null)}
          title={`${
            activeModalState.slot.title ||
            activeModalState.slot.size?.title ||
            "Photo"
          } #${activeModalState.index + 1}`}
          photoIds={
            eligiblePhotoIds.length > 0 ? eligiblePhotoIds : favoriteIds
          }
          selectedPhotoId={
            watchedSlotSelections[activeModalState.slot.id]?.[
              activeModalState.index
            ]
          }
          onSelectPhoto={(photoId) => {
            const currentList = [
              ...(watchedSlotSelections[activeModalState.slot.id] || []),
            ];
            currentList[activeModalState.index] = photoId;
            setValue(
              `slotSelections.${activeModalState.slot.id}`,
              currentList,
              {
                shouldValidate: true,
              },
            );
          }}
        />
      )}
    </div>
  );
}


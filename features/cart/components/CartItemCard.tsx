"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Minus, Plus, Loader2, Frame, Package, Gift } from "lucide-react";
import { CartItem } from "../types/cart";
import { fetchPhotoPreviewBlob } from "@/features/access-cards/utils/access-cards-api";
import { useCart } from "../hooks/useCart";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateItemQuantity, removeItem, isRemoving } = useCart();
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    item.photos?.[0]?.media?.url || null
  );
  const [isLocalLoading, setIsLocalLoading] = useState<boolean>(false);

  const firstPhotoId = item.photos?.[0]?.id;

  useEffect(() => {
    if (photoUrl || !firstPhotoId) return;

    let isMounted = true;
    fetchPhotoPreviewBlob(firstPhotoId)
      .then((url) => {
        if (isMounted) {
          setPhotoUrl(url);
        }
      })
      .catch(() => {
        // Fallback handled by frame icon
      });

    return () => {
      isMounted = false;
    };
  }, [firstPhotoId, photoUrl]);

  const handleDecrement = async () => {
    if (item.quantity <= 1) return;
    setIsLocalLoading(true);
    try {
      await updateItemQuantity(item.id, item.quantity - 1);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleIncrement = async () => {
    setIsLocalLoading(true);
    try {
      await updateItemQuantity(item.id, item.quantity + 1);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLocalLoading(true);
    try {
      await removeItem(item.id);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const lineTotalNum = parseFloat(item.lineTotal || "0");
  const formattedLineTotal = `€${lineTotalNum.toFixed(2)}`;
  
  const descriptionText =
    item.kind === "PRODUCT"
      ? "Store Product Item"
      : item.kind === "GIFT_VOUCHER"
        ? "Digital Gift Voucher"
        : (item.photos?.length || 1) > 1
          ? `${item.photos?.length} photos included`
          : "1 digital photo";

  const isBusy = isLocalLoading;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-6 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center justify-between">
      {/* Left side: Thumbnail + Info */}
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
        {/* Frame / Photo / Product Preview */}
        <div className="relative shrink-0 w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-xl overflow-hidden border border-neutral-200/90 bg-neutral-100 flex items-center justify-center shadow-xs">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 80px, 112px"
              className="object-cover pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
              {item.kind === "PRODUCT" ? (
                <Package className="size-6 mb-1 text-neutral-400" />
              ) : item.kind === "GIFT_VOUCHER" ? (
                <Gift className="size-6 mb-1 text-neutral-400" />
              ) : (
                <Frame className="size-6 mb-1 text-neutral-400" />
              )}
              <span className="text-[10px] font-mono text-neutral-500 leading-tight">
                {item.kind === "PRODUCT"
                  ? "Product"
                  : item.kind === "GIFT_VOUCHER"
                    ? "Voucher"
                    : item.format?.title || "Format"}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between sm:hidden">
            <h3 className="text-sm font-bold text-neutral-900 truncate">
              {item.title}
            </h3>
            {/* Mobile delete button */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isRemoving}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors p-1"
              aria-label="Delete item"
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <h3 className="hidden sm:block text-base md:text-lg font-bold text-neutral-900 truncate">
            {item.title}
          </h3>

          <p className="text-xs text-neutral-500 font-medium">
            {descriptionText}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight">
              {formattedLineTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Quantity Controls & Desktop Delete */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
        {/* Quantity Controls */}
        <div className="flex items-center border border-neutral-200 rounded-full px-2 py-1 bg-neutral-50/80 shrink-0">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={item.quantity <= 1 || isBusy}
            className="size-6 sm:size-7 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-semibold text-neutral-800">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={isBusy}
            className="size-6 sm:size-7 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="size-3" />
          </button>
        </div>

        {/* Desktop Delete button */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isRemoving}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Delete item"
        >
          {isRemoving ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

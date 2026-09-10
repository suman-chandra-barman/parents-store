"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Loader2, Frame } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PaperFormatItem } from "../types/paper-formats";
import { useAddToCartMutation } from "@/features/cart/api/cartApi";
import { getOrCreateCartSessionId } from "@/features/cart/utils/cart-api";
import { parseErrorMessage } from "@/utils/parseErrorMessage";

export interface PaperFormatCardProps {
  format: PaperFormatItem;
  photoId?: string;
  onAddToCart?: (formatId: string, quantity: number) => Promise<void>;
}

export function PaperFormatCard({
  format,
  photoId,
  onAddToCart,
}: PaperFormatCardProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isLocalAdding, setIsLocalAdding] = useState<boolean>(false);
  const [addToCartMutation, { isLoading: isMutationLoading }] =
    useAddToCartMutation();

  const isAdding = isLocalAdding || isMutationLoading;

  const priceObj =
    format.prices?.find((p) => p.isDefault) || format.prices?.[0];
  const rawPrice = priceObj ? priceObj.price : format.oneOffCost || "0.00";
  const numericPrice = parseFloat(rawPrice) || 0;
  const formattedPrice = `$${numericPrice.toFixed(2)}`;

  // Slight decorative original strike price if non-zero
  const strikePrice =
    numericPrice > 0 ? `$${(numericPrice * 1.18).toFixed(2)}` : null;

  const previewImageUrl =
    format.size?.preview?.[0]?.url || format.size?.previews?.[0]?.url;

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(9999, prev + 1));
  };

  const handleAdd = async () => {
    if (onAddToCart) {
      setIsLocalAdding(true);
      try {
        await onAddToCart(format.id, quantity);
      } finally {
        setIsLocalAdding(false);
      }
      return;
    }

    if (!photoId) {
      toast.error("Please select a photo before adding to cart");
      return;
    }

    const sessionId = getOrCreateCartSessionId();
    try {
      await addToCartMutation({
        sessionId,
        payload: {
          kind: "PHOTO",
          formatId: format.id,
          quantity,
          photoIds: [photoId],
        },
      }).unwrap();
      toast.success("Added to cart successfully 🛒");
    } catch (err: unknown) {
      toast.error(parseErrorMessage(err, "Failed to add to cart"));
    }
  };

  return (
    <div className="group relative bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center justify-between">
      {/* Top part on mobile: Image + Main Details */}
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
        {/* Left side: Photo Frame Mockup */}
        <div className="relative shrink-0 w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-xl overflow-hidden border border-neutral-200/90 bg-neutral-100 flex items-center justify-center shadow-xs">
          {previewImageUrl ? (
            <Image
              src={previewImageUrl}
              alt={format.title}
              fill
              sizes="(max-width: 640px) 80px, 112px"
              className="object-cover pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
              <Frame className="size-6 mb-1 text-neutral-400" />
              <span className="text-[10px] font-mono leading-tight text-neutral-500">
                {format.size?.title || "Format"}
              </span>
            </div>
          )}
        </div>

        {/* Middle: Format Details */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 truncate">
              {format.title}
            </h3>
            {(format.isMine || format.category?.title) && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] sm:text-[11px] font-medium bg-emerald-100/90 text-emerald-800 border border-emerald-200">
                {format.category?.title || "Popular"}
              </span>
            )}
          </div>

          {/* Size Info */}
          {format.size?.title && (
            <div className="text-xs text-neutral-500 font-medium truncate">
              {format.size.title}
              {format.size?.group?.title && (
                <span className="text-neutral-400 ml-1.5">
                  ({format.size.group.title})
                </span>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-0.5 sm:pt-1">
            {strikePrice && (
              <span className="text-xs text-neutral-400 line-through">
                {strikePrice}
              </span>
            )}
            <span className="text-base sm:text-lg md:text-xl font-extrabold text-neutral-900 tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <p className="text-[10px] sm:text-[11px] text-neutral-400 leading-snug">
            VAT included, postage calculated at checkout.
          </p>
        </div>
      </div>

      {/* Bottom on mobile / Right on desktop: Quantity & Add to Cart */}
      <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
        {/* Quantity Controls */}
        <div className="flex items-center border border-neutral-200 rounded-full px-2 py-1 bg-neutral-50/80 shrink-0">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= 1 || isAdding}
            className="size-6 sm:size-7 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-semibold text-neutral-800">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={quantity >= 9999 || isAdding}
            className="size-6 sm:size-7 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="size-3" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isAdding}
          className={cn(
            "flex-1 sm:flex-initial px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer",
            "bg-[#2060b0] hover:bg-[#1a4f94] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {isAdding ? (
            <Loader2 className="size-4 animate-spin text-white" />
          ) : (
            <ShoppingBag className="size-4" />
          )}
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingBag, Loader2, Frame } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaperFormatItem } from "../types/paper-formats";

export interface PaperFormatCardProps {
  format: PaperFormatItem;
  photoBlobUrl?: string | null;
  onAddToCart: (formatId: string, quantity: number) => Promise<void>;
}

export function PaperFormatCard({
  format,
  photoBlobUrl,
  onAddToCart,
}: PaperFormatCardProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const priceObj =
    format.prices?.find((p) => p.isDefault) || format.prices?.[0];
  const rawPrice = priceObj ? priceObj.price : format.oneOffCost || "0.00";
  const numericPrice = parseFloat(rawPrice) || 0;
  const formattedPrice = `$${numericPrice.toFixed(2)}`;

  // Slight decorative original strike price if non-zero
  const strikePrice =
    numericPrice > 0 ? `$${(numericPrice * 1.18).toFixed(2)}` : null;

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(9999, prev + 1));
  };

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      await onAddToCart(format.id, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
      {/* Left side: Photo Frame Mockup */}
      <div className="relative shrink-0 w-24 h-32 sm:w-28 sm:h-36 bg-neutral-900 rounded-lg p-2 shadow-lg flex items-center justify-center overflow-hidden border-2 border-neutral-800">
        <div className="relative w-full h-full rounded-xs overflow-hidden bg-neutral-100 flex items-center justify-center">
          {photoBlobUrl ? (
            <Image
              src={photoBlobUrl}
              alt={format.title}
              fill
              sizes="112px"
              className="object-cover pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
              <Frame className="size-6 mb-1 text-neutral-300" />
              <span className="text-[9px] font-mono leading-tight">
                {format.size?.title || "Format"}
              </span>
            </div>
          )}
        </div>
        {/* Frame easel leg shadow highlight */}
        <div className="absolute -bottom-1 -right-1 size-3 bg-black/40 rotate-45 pointer-events-none" />
      </div>

      {/* Middle: Format Details */}
      <div className="flex-1 min-w-0 space-y-1.5 w-full">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 truncate">
            {format.title}
          </h3>
          {(format.isMine || format.category?.title) && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium bg-emerald-100/90 text-emerald-800 border border-emerald-200">
              {format.category?.title || "Popular"}
            </span>
          )}
        </div>

        {/* Rating Stars & Size */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="size-3 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="font-medium text-neutral-700">5.0</span>
          {format.size?.title && (
            <>
              <span className="text-neutral-300">•</span>
              <span className="font-medium text-neutral-600">
                {format.size.title}
              </span>
            </>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1">
          {strikePrice && (
            <span className="text-xs text-neutral-400 line-through">
              {strikePrice}
            </span>
          )}
          <span className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
            {formattedPrice}
          </span>
        </div>

        <p className="text-[11px] text-neutral-400 leading-snug">
          VAT included, postage calculated at checkout.
        </p>
      </div>

      {/* Right / Bottom: Quantity & Add to Cart */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0">
        {/* Quantity Controls */}
        <div className="flex items-center border border-neutral-200 rounded-full px-2 py-1 bg-neutral-50/80">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= 1 || isAdding}
            className="size-6 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-8 text-center text-xs font-semibold text-neutral-800">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={quantity >= 9999 || isAdding}
            className="size-6 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
            "px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer",
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

"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
  Gift,
  Eye,
  Check,
  Sparkles,
  Palette,
  MessageSquare,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GiftVoucherItem } from "../types/gift-vouchers";
import { useCart } from "@/features/cart/hooks/useCart";

export interface GiftVoucherCardProps {
  voucher: GiftVoucherItem;
  onQuickView?: (voucher: GiftVoucherItem) => void;
}

export function GiftVoucherCard({ voucher, onQuickView }: GiftVoucherCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | undefined>(
    () => voucher.layouts?.[0]?.id
  );
  const [personalMessage, setPersonalMessage] = useState<string>("");
  const [hideValue, setHideValue] = useState<boolean>(false);
  const [showPersonalize, setShowPersonalize] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const priceNum = parseFloat(voucher.price) || 0;
  const valueNum = parseFloat(voucher.value) || priceNum;
  const formattedPrice = `€${priceNum.toFixed(2)}`;
  const formattedValue = `€${valueNum.toFixed(2)}`;
  const savings = valueNum > priceNum ? valueNum - priceNum : 0;

  const previewUrl = voucher.preview?.url;

  const cleanDescription = voucher.description
    ? voucher.description.replace(/<[^>]*>?/gm, "").trim()
    : "";

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(9999, prev + 1));
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);

    const activeLayoutId =
      selectedLayoutId || voucher.layouts?.[0]?.id || undefined;

    try {
      await addToCart({
        kind: "GIFT_VOUCHER",
        voucherId: voucher.id,
        quantity,
        layoutId: activeLayoutId,
        message: personalMessage.trim() || undefined,
        hideValue: hideValue || undefined,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch {
      // toast error handled by CartContext
    } finally {
      setIsAdding(false);
    }
  };

  const selectedLayout = voucher.layouts?.find((l) => l.id === selectedLayoutId) || voucher.layouts?.[0];

  return (
    <div className="group relative bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top Details & Certificate Mockup */}
      <div className="space-y-3.5">
        {/* Certificate Card Header / Mockup */}
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-linear-to-br from-amber-500/10 via-amber-500/5 to-purple-500/10 border border-amber-200/80 p-4 flex flex-col justify-between">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={voucher.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="size-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                  <Gift className="size-4 stroke-[2]" />
                </div>
                <Sparkles className="size-4 text-amber-500" />
              </div>

              <div className="text-center py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  {hideValue ? "Gift Certificate" : "Gift Voucher"}
                </span>
                <span className="text-2xl font-black text-neutral-900 tracking-tight">
                  {hideValue ? "Special Gift" : formattedValue}
                </span>
                {selectedLayout && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/90 text-amber-900 border border-amber-200 shadow-2xs">
                    Theme: {selectedLayout.name}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1.5 border-t border-amber-200/60">
                <span>{hideValue ? "Value Hidden" : `Value: ${formattedValue}`}</span>
                <span className="text-amber-800 font-bold">LumiPhoto</span>
              </div>
            </>
          )}

          {/* Quick View Floating Button */}
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(voucher)}
              className="absolute top-2.5 right-2.5 size-8 rounded-full bg-white/90 backdrop-blur-xs text-neutral-700 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center hover:bg-white hover:text-neutral-900 cursor-pointer"
              aria-label="Full Details & Preview"
              title="Full Details & Preview"
            >
              <Eye className="size-4" />
            </button>
          )}

          {/* Category Chip */}
          {voucher.category && (
            <div className="absolute top-2.5 left-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 text-amber-800 backdrop-blur-xs shadow-2xs border border-neutral-100">
                {voucher.category}
              </span>
            </div>
          )}
        </div>

        {/* Voucher Info */}
        <div className="space-y-2">
          <h3
            className="text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-brand transition-colors cursor-pointer"
            onClick={() => onQuickView?.(voucher)}
            title={voucher.title}
          >
            {voucher.title}
          </h3>

          {cleanDescription && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {cleanDescription}
            </p>
          )}

          {/* Layout Themes Selection on Card */}
          {voucher.layouts && voucher.layouts.length > 0 && (
            <div className="space-y-1.5 pt-1.5 border-t border-neutral-100">
              <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Palette className="size-3 text-brand" />
                  <span>Voucher Design</span>
                </span>
                <span className="text-neutral-400 font-normal normal-case">
                  {selectedLayout?.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {voucher.layouts.map((layout) => {
                  const isSelected = selectedLayoutId === layout.id;
                  return (
                    <button
                      key={layout.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLayoutId(layout.id);
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-1",
                        isSelected
                          ? "bg-brand text-white border-brand shadow-2xs"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-200"
                      )}
                      title={layout.description || layout.name}
                    >
                      {isSelected && <Check className="size-3" />}
                      <span>{layout.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Personalize Button Toggle (Message & Hide Value) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowPersonalize((prev) => !prev)}
              className="w-full py-1 px-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-[11px] font-semibold text-neutral-700 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <MessageSquare className="size-3 text-brand" />
                <span>
                  {personalMessage || hideValue
                    ? "Personalized Gift Active ✨"
                    : "Add Personal Message / Options"}
                </span>
              </span>
              {showPersonalize ? (
                <ChevronUp className="size-3.5 text-neutral-400" />
              ) : (
                <ChevronDown className="size-3.5 text-neutral-400" />
              )}
            </button>

            {/* Expandable Personalization Box */}
            {showPersonalize && (
              <div className="mt-2 p-2.5 bg-neutral-50/90 rounded-xl border border-neutral-200/90 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-neutral-600">
                      Personal Message
                    </label>
                    <span className="text-[9px] text-neutral-400">
                      {personalMessage.length}/2000
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={2000}
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder="Write a message for the recipient..."
                    className="w-full text-xs p-2 rounded-lg border border-neutral-200 bg-white focus:outline-hidden focus:border-brand focus:ring-1 focus:ring-brand/20 placeholder:text-neutral-400"
                  />
                </div>

                <label className="flex items-center gap-2 p-1.5 rounded-lg border border-neutral-200/80 bg-white hover:bg-neutral-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={hideValue}
                    onChange={(e) => setHideValue(e.target.checked)}
                    className="rounded border-neutral-300 text-brand focus:ring-brand size-3.5 cursor-pointer"
                  />
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-700">
                    <EyeOff className="size-3 text-neutral-500" />
                    <span>Hide price/value on voucher card</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Pricing, Quantity & Add to Cart */}
      <div className="pt-4 mt-3 border-t border-neutral-100 space-y-3">
        {/* Pricing & Savings */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-extrabold text-neutral-900 tracking-tight">
              {formattedPrice}
            </span>
            {savings > 0 && (
              <span className="block text-[10px] font-semibold text-emerald-600">
                Save €{savings.toFixed(2)} (Value {formattedValue})
              </span>
            )}
          </div>
          {quantity > 1 && (
            <span className="text-xs font-semibold text-neutral-600">
              Total: €{(priceNum * quantity).toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions row: Quantity selector + Add to Cart */}
        <div className="flex items-center gap-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-neutral-200 rounded-lg px-1.5 py-1 bg-neutral-50/80 shrink-0">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1 || isAdding}
              className="size-6 rounded-md flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-neutral-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= 9999 || isAdding}
              className="size-6 rounded-md flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg font-semibold text-xs text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              isSuccess
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-brand hover:opacity-90 active:scale-98",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            {isAdding ? (
              <Loader2 className="size-3.5 animate-spin text-white" />
            ) : isSuccess ? (
              <Check className="size-3.5 text-white" />
            ) : (
              <ShoppingBag className="size-3.5" />
            )}
            <span>{isSuccess ? "Added" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

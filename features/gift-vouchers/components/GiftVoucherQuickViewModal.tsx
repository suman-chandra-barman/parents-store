"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Loader2, Gift, Check, Sparkles, Calendar, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { GiftVoucherItem } from "../types/gift-vouchers";
import { useCart } from "@/features/cart/hooks/useCart";

interface GiftVoucherQuickViewModalProps {
  voucher: GiftVoucherItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GiftVoucherQuickViewModal({
  voucher,
  isOpen,
  onClose,
}: GiftVoucherQuickViewModalProps) {
  if (!isOpen || !voucher) return null;

  return (
    <GiftVoucherQuickViewModalContent
      key={voucher.id}
      voucher={voucher}
      onClose={onClose}
    />
  );
}

function GiftVoucherQuickViewModalContent({
  voucher,
  onClose,
}: {
  voucher: GiftVoucherItem;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const priceNum = parseFloat(voucher.price) || 0;
  const valueNum = parseFloat(voucher.value) || priceNum;
  const formattedPrice = `€${priceNum.toFixed(2)}`;
  const formattedValue = `€${valueNum.toFixed(2)}`;
  const savings = valueNum > priceNum ? valueNum - priceNum : 0;

  const previewUrl = voucher.preview?.url;

  const cleanDescription = voucher.description
    ? voucher.description.replace(/<[^>]*>?/gm, "").trim()
    : "";

  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrement = () => setQuantity((prev) => Math.min(9999, prev + 1));

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        kind: "GIFT_VOUCHER",
        voucherId: voucher.id,
        quantity,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch {
      // Error handled by CartContext
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Certificate Design / Preview */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-linear-to-br from-amber-500/10 via-amber-500/5 to-purple-500/10 border border-amber-200/80 p-6 flex flex-col justify-between shadow-xs">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={voucher.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover pointer-events-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Gift className="size-5 stroke-[2]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                          Official Voucher
                        </span>
                        <p className="text-xs font-semibold text-neutral-600">
                          LumiPhoto Store
                        </p>
                      </div>
                    </div>
                    <Sparkles className="size-5 text-amber-500" />
                  </div>

                  <div className="text-center py-4">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest block mb-1">
                      Gift Voucher Value
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                      {formattedValue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-amber-200/60">
                    <span>Redeemable Online</span>
                    <span>Valid 12 Months</span>
                  </div>
                </>
              )}
            </div>

            {/* Layout Themes */}
            {voucher.layouts && voucher.layouts.length > 0 && (
              <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                  <Palette className="size-3.5 text-[#2060b0]" />
                  <span>Included Design Layouts ({voucher.layouts.length})</span>
                </div>
                <div className="space-y-1.5">
                  {voucher.layouts.map((layout) => (
                    <div
                      key={layout.id}
                      className="p-2 bg-white rounded-lg border border-neutral-200/60 text-xs flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-neutral-900">
                          {layout.name}
                        </span>
                        {layout.description && (
                          <p className="text-[11px] text-neutral-500">
                            {layout.description}
                          </p>
                        )}
                      </div>
                      {layout.fontFamily && (
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                          {layout.fontFamily}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex flex-col h-full justify-between space-y-5">
            <div className="space-y-3">
              {voucher.category && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  {voucher.category}
                </span>
              )}

              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                {voucher.title}
              </h2>

              {/* Pricing breakdown */}
              <div className="p-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/70 space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Voucher Value
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-900">
                    {formattedValue}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-neutral-600">
                  <span>Purchase Price:</span>
                  <span className="font-extrabold text-sm text-neutral-900">
                    {formattedPrice}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="pt-1 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>You Save:</span>
                    <span>€{savings.toFixed(2)} Bonus Value</span>
                  </div>
                )}
              </div>

              {cleanDescription && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    About this Voucher
                  </h4>
                  <p className="text-sm text-neutral-600 leading-relaxed max-h-36 overflow-y-auto">
                    {cleanDescription}
                  </p>
                </div>
              )}

              {voucher.availableTo && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-1">
                  <Calendar className="size-3.5 text-neutral-400" />
                  <span>
                    Valid through{" "}
                    {new Date(voucher.availableTo).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-neutral-700">
                  Quantity
                </span>
                <div className="flex items-center border border-neutral-200 rounded-full px-2 py-1 bg-neutral-50 shrink-0">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || isAdding}
                    className="size-7 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-neutral-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={quantity >= 9999 || isAdding}
                    className="size-7 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className={cn(
                  "w-full py-3.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer",
                  isSuccess
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-[#2060b0] hover:bg-[#1a4f94] active:scale-[0.98]",
                  "disabled:opacity-60 disabled:cursor-not-allowed"
                )}
              >
                {isAdding ? (
                  <Loader2 className="size-4 animate-spin text-white" />
                ) : isSuccess ? (
                  <Check className="size-4 text-white" />
                ) : (
                  <ShoppingBag className="size-4" />
                )}
                <span>
                  {isSuccess
                    ? "Added to Cart!"
                    : `Add to Cart • €${(priceNum * quantity).toFixed(2)}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
  Gift,
  Check,
  Sparkles,
  Calendar,
  Palette,
  EyeOff,
  MessageSquare,
} from "lucide-react";
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
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | undefined>(
    voucher.layouts?.[0]?.id
  );
  const [personalMessage, setPersonalMessage] = useState<string>("");
  const [hideValue, setHideValue] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<string>("");
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
        layoutId: selectedLayoutId || undefined,
        message: personalMessage.trim() || undefined,
        hideValue: hideValue || undefined,
        sendAt: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
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

  const selectedLayout = voucher.layouts?.find((l) => l.id === selectedLayoutId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
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
          {/* Certificate Design / Preview & Layout Selector */}
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
                      {hideValue ? "Gift Certificate" : "Gift Voucher Value"}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                      {hideValue ? "Special Gift" : formattedValue}
                    </span>
                    {selectedLayout && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/80 text-amber-900 border border-amber-200">
                        Theme: {selectedLayout.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-amber-200/60">
                    <span>Redeemable Online</span>
                    <span>Valid 12 Months</span>
                  </div>
                </>
              )}
            </div>

            {/* Design Layouts Selection */}
            {voucher.layouts && voucher.layouts.length > 0 && (
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                    <Palette className="size-3.5 text-brand" />
                    <span>Choose Voucher Design</span>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-400">
                    {voucher.layouts.length} designs available
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {voucher.layouts.map((layout) => {
                    const isSelected = selectedLayoutId === layout.id;
                    return (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => setSelectedLayoutId(layout.id)}
                        className={cn(
                          "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1",
                          isSelected
                            ? "bg-brand/10 border-brand ring-2 ring-brand/20"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-neutral-900">
                            {layout.name}
                          </span>
                          {isSelected && (
                            <Check className="size-3.5 text-brand" />
                          )}
                        </div>
                        {layout.description && (
                          <p className="text-[10px] text-neutral-500 line-clamp-2 leading-tight">
                            {layout.description}
                          </p>
                        )}
                        {layout.fontFamily && (
                          <span className="text-[9px] font-mono text-neutral-400">
                            Font: {layout.fontFamily}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Details, Customization & Actions */}
          <div className="flex flex-col h-full justify-between space-y-5">
            <div className="space-y-3.5">
              {voucher.category && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  {voucher.category}
                </span>
              )}

              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                {voucher.title}
              </h2>

              {/* Pricing breakdown */}
              <div className="p-3.5 bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/70 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Voucher Value
                  </span>
                  <span className="text-xl font-black text-amber-900">
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

              {/* Customization Inputs */}
              <div className="space-y-3 pt-1">
                {/* Personal Message */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="voucher-message"
                      className="flex items-center gap-1.5 text-xs font-bold text-neutral-700"
                    >
                      <MessageSquare className="size-3 text-neutral-500" />
                      <span>Personal Message (Optional)</span>
                    </label>
                    <span className="text-[10px] text-neutral-400">
                      {personalMessage.length}/2000
                    </span>
                  </div>
                  <textarea
                    id="voucher-message"
                    rows={2}
                    maxLength={2000}
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder="Add a heartfelt note for the recipient..."
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-neutral-400 bg-neutral-50/50"
                  />
                </div>

                {/* Scheduled delivery & Hide value row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Scheduled Delivery */}
                  <div className="space-y-1">
                    <label
                      htmlFor="voucher-date"
                      className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700"
                    >
                      <Calendar className="size-3 text-neutral-500" />
                      <span>Delivery Date (Optional)</span>
                    </label>
                    <input
                      id="voucher-date"
                      type="date"
                      value={scheduledDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-brand bg-neutral-50/50 cursor-pointer"
                    />
                  </div>

                  {/* Hide Value Toggle */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 p-2 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/50 cursor-pointer w-full transition-colors mt-auto">
                      <input
                        type="checkbox"
                        checked={hideValue}
                        onChange={(e) => setHideValue(e.target.checked)}
                        className="rounded border-neutral-300 text-brand focus:ring-brand size-4 cursor-pointer"
                      />
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700">
                        <EyeOff className="size-3 text-neutral-500" />
                        <span>Hide value on card</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {cleanDescription && (
                <div className="pt-2 border-t border-neutral-100">
                  <h4 className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-0.5">
                    About this Voucher
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed max-h-20 overflow-y-auto">
                    {cleanDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t border-neutral-100">
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
                    : "bg-brand hover:opacity-90 active:scale-98",
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

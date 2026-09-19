"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
  Gift,
  Eye,
  Check,
  MessageSquare,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { cn } from "@/lib/utils";
import { GiftVoucherItem } from "../types/gift-vouchers";
import { useCart } from "@/features/cart/hooks/useCart";

export interface GiftVoucherCardProps {
  voucher: GiftVoucherItem;
  onQuickView?: (voucher: GiftVoucherItem) => void;
}

export function GiftVoucherCard({
  voucher,
  onQuickView,
}: GiftVoucherCardProps) {
  const t = useTranslations("GiftVouchers");
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | undefined>(
    () => voucher.layouts?.[0]?.id,
  );
  const [personalMessage, setPersonalMessage] = useState<string>("");
  const [hideValue, setHideValue] = useState<boolean>(false);
  const [showPersonalize, setShowPersonalize] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  const priceNum = parseFloat(voucher.price) || 0;
  const valueNum = parseFloat(voucher.value) || priceNum;
  const formattedPrice = `€${priceNum.toFixed(2)}`;
  const formattedValue = `€${valueNum.toFixed(2)}`;
  const savings = valueNum > priceNum ? valueNum - priceNum : 0;

  const previewUrl = voucher.preview?.url;
  const showImage = Boolean(previewUrl && !imageError);

  // Sanitize Rich Text HTML Description from backend editor
  const sanitizedDescription = useMemo(() => {
    if (!voucher.description) return "";
    return sanitizeHtml(voucher.description, {
      allowedTags: [
        "b",
        "i",
        "em",
        "strong",
        "a",
        "p",
        "br",
        "ul",
        "ol",
        "li",
        "span",
        "sub",
        "sup",
        "strike",
        "u",
      ],
      allowedAttributes: {
        a: ["href", "target", "rel"],
        span: ["class", "style"],
        p: ["class", "style"],
      },
    });
  }, [voucher.description]);

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

  const selectedLayout =
    voucher.layouts?.find((l) => l.id === selectedLayoutId) ||
    voucher.layouts?.[0];

  return (
    <div className="group relative bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Details & Certificate Mockup / Preview */}
      <div className="space-y-3.5">
        {/* Certificate Card Header / Mockup Banner */}
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-linear-to-br from-amber-500/15 via-orange-500/10 to-amber-600/20 border border-amber-200/80 p-3.5 sm:p-4 flex flex-col justify-between shadow-inner">
          {showImage ? (
            <Image
              src={previewUrl!}
              alt={voucher.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
              draggable={false}
              onError={() => setImageError(true)}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            /* Simple & Clean Placeholder */
            <div className="flex flex-col items-center justify-center h-full text-center p-4 select-none">
              <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-200/60 text-amber-600 flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                <Gift className="size-6 stroke-[1.75]" />
              </div>
              <span className="text-xs font-bold text-neutral-700 tracking-tight line-clamp-1">
                {voucher.title}
              </span>
              <span className="text-[10px] font-medium text-neutral-400 mt-0.5">
                {t("officialVoucher")}
              </span>
            </div>
          )}

          {/* Quick View Floating Button */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(voucher);
              }}
              className="absolute top-2.5 right-2.5 z-10 size-8 rounded-full bg-white/90 backdrop-blur-md text-neutral-700 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center hover:bg-white hover:text-neutral-900 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label={t("fullDetailsPreview")}
              title={t("fullDetailsPreview")}
            >
              <Eye className="size-4" />
            </button>
          )}

          {/* Category Chip */}
          {voucher.category && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-amber-900 backdrop-blur-md shadow-2xs border border-amber-100">
                {voucher.category}
              </span>
            </div>
          )}
        </div>

        {/* Voucher Info & Rich Text Description */}
        <div className="space-y-2.5">
          <h3
            className="text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-brand transition-colors cursor-pointer"
            onClick={() => onQuickView?.(voucher)}
            title={voucher.title}
          >
            {voucher.title}
          </h3>

          {/* Rich Text Editor HTML Description */}
          {sanitizedDescription && (
            <div className="space-y-1">
              <div
                className={cn(
                  "text-xs text-neutral-600 leading-relaxed",
                  "prose prose-xs max-w-none dark:prose-invert",
                  "[&_p]:mb-1 [&_p:last-child]:mb-0",
                  "[&_strong]:font-semibold [&_strong]:text-neutral-800",
                  "[&_em]:italic",
                  "[&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1 [&_ul]:space-y-0.5",
                  "[&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-1 [&_ol]:space-y-0.5",
                  "[&_li]:text-neutral-600",
                  "[&_a]:text-brand [&_a]:underline [&_a:hover]:opacity-80",
                  isDescriptionExpanded
                    ? "max-h-48 overflow-y-auto pr-1"
                    : "line-clamp-2 max-h-10 overflow-hidden",
                )}
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
              {voucher.description && voucher.description.length > 90 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDescriptionExpanded((prev) => !prev);
                  }}
                  className="text-[11px] font-semibold text-brand hover:underline cursor-pointer inline-flex items-center gap-0.5"
                >
                  <span>
                    {isDescriptionExpanded ? t("showLess") : t("readMore")}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Layout Themes Selection */}
          {voucher.layouts && voucher.layouts.length > 0 && (
            <div className="space-y-1.5 pt-1.5 border-t border-neutral-100">
              <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                <span>{t("voucherDesign")}</span>
                <span className="text-neutral-400 font-normal normal-case">
                  {selectedLayout?.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
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
                        "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1",
                        isSelected
                          ? "bg-brand text-white border-brand shadow-2xs"
                          : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200/80",
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
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setShowPersonalize((prev) => !prev)}
              className="w-full py-1.5 px-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/80 text-[11px] font-semibold text-neutral-700 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-brand shrink-0" />
                <span className="truncate">
                  {personalMessage || hideValue
                    ? `✨ ${t("personalizedActive")}`
                    : t("personalizeGift")}
                </span>
              </span>
              {showPersonalize ? (
                <ChevronUp className="size-3.5 text-neutral-400 shrink-0" />
              ) : (
                <ChevronDown className="size-3.5 text-neutral-400 shrink-0" />
              )}
            </button>

            {/* Expandable Personalization Box */}
            {showPersonalize && (
              <div className="mt-2 p-2.5 bg-neutral-50/90 rounded-xl border border-neutral-200/90 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-neutral-600">
                      {t("personalMessage")}
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
                    placeholder={t("messagePlaceholder")}
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
                    <span>{t("hideValue")}</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Pricing, Quantity & Add to Cart */}
      <div className="pt-3.5 mt-3 border-t border-neutral-100 space-y-2.5">
        {/* Pricing & Savings */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-extrabold text-neutral-900 tracking-tight">
              {formattedPrice}
            </span>
            {savings > 0 && (
              <span className="block text-[10px] font-bold text-emerald-600">
                {t("youSave")} €{savings.toFixed(2)} ({t("voucherValue")}{" "}
                {formattedValue})
              </span>
            )}
          </div>
          {quantity > 1 && (
            <span className="text-xs font-semibold text-neutral-600">
              {t("total")}: €{(priceNum * quantity).toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions row: Quantity selector + Add to Cart */}
        <div className="flex items-center gap-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-neutral-200 rounded-xl px-1 py-0.5 bg-neutral-50 shrink-0">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1 || isAdding}
              className="size-7 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
              className="size-7 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
              "flex-1 py-2 px-3 rounded-xl font-semibold text-xs text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              isSuccess
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-brand hover:opacity-90 active:scale-98",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            )}
          >
            {isAdding ? (
              <Loader2 className="size-3.5 animate-spin text-white" />
            ) : isSuccess ? (
              <Check className="size-3.5 text-white" />
            ) : (
              <ShoppingBag className="size-3.5" />
            )}
            <span>{isSuccess ? t("added") : t("addToCart")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

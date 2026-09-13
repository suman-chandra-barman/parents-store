"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Loader2, Package, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductItem } from "../types/products";
import { useCart } from "@/features/cart/hooks/useCart";

interface ProductQuickViewModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
}: ProductQuickViewModalProps) {
  if (!isOpen || !product) return null;

  return (
    <ProductQuickViewModalContent
      key={product.id}
      product={product}
      onClose={onClose}
    />
  );
}

function ProductQuickViewModalContent({
  product,
  onClose,
}: {
  product: ProductItem;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
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

  const medias = product.medias || [];
  const currentMedia = medias[selectedMediaIndex] || medias[0];
  const priceNum = parseFloat(product.price) || 0;
  const formattedPrice = `€${priceNum.toFixed(2)}`;

  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, "").trim()
    : "";

  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrement = () => setQuantity((prev) => Math.min(9999, prev + 1));

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        kind: "PRODUCT",
        productId: product.id,
        quantity,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch {
      // toast error is already handled by CartContext
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
          {/* Media preview section */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 flex items-center justify-center shadow-xs">
              {currentMedia?.url ? (
                <Image
                  src={currentMedia.url}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover pointer-events-none transition-all duration-300"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
                  <Package className="size-16 mb-2 text-neutral-300 stroke-[1.2]" />
                  <span className="text-xs text-neutral-400 font-medium">
                    No image preview
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail list */}
            {medias.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {medias.map((m, idx) => (
                  <button
                    key={m.id || idx}
                    type="button"
                    onClick={() => setSelectedMediaIndex(idx)}
                    className={cn(
                      "relative size-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-neutral-100",
                      selectedMediaIndex === idx
                        ? "border-[#2060b0] ring-2 ring-[#2060b0]/20"
                        : "border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={m.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="56px"
                      className="object-cover pointer-events-none"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="flex flex-col h-full justify-between space-y-5">
            <div className="space-y-3">
              {product.category && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-[#2060b0] border border-blue-100">
                  {product.category}
                </span>
              )}

              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                {product.title}
              </h2>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {formattedPrice}
                </span>
                {product.vatRate && (
                  <span className="text-xs text-neutral-500 font-medium">
                    Incl. {product.vatRate}% VAT
                  </span>
                )}
              </div>

              {cleanDescription && (
                <div className="pt-2 border-t border-neutral-100">
                  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Description
                  </h4>
                  <p className="text-sm text-neutral-600 leading-relaxed max-h-48 overflow-y-auto">
                    {cleanDescription}
                  </p>
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

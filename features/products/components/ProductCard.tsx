"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Loader2, Package, Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductItem } from "../types/products";
import { useCart } from "@/features/cart/hooks/useCart";

export interface ProductCardProps {
  product: ProductItem;
  onQuickView?: (product: ProductItem) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const priceNum = parseFloat(product.price) || 0;
  const formattedPrice = `€${priceNum.toFixed(2)}`;

  const primaryMedia = product.medias?.[0];
  const previewImageUrl = primaryMedia?.url;

  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, "").trim()
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
      // toast error handled by CartContext
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top Media & Details */}
      <div className="space-y-3.5">
        {/* Product Media Thumbnail */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 flex items-center justify-center">
          {previewImageUrl ? (
            <Image
              src={previewImageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400 p-4 text-center">
              <Package className="size-12 mb-1.5 text-neutral-300 stroke-[1.2]" />
              <span className="text-[11px] font-mono text-neutral-400">
                {product.category || "Product"}
              </span>
            </div>
          )}

          {/* Quick View Floating Button */}
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="absolute top-2.5 right-2.5 size-8 rounded-full bg-white/90 backdrop-blur-xs text-neutral-700 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center hover:bg-white hover:text-neutral-900 cursor-pointer"
              aria-label="Quick view"
              title="Quick view"
            >
              <Eye className="size-4" />
            </button>
          )}

          {/* Category Chip Overlay */}
          {product.category && (
            <div className="absolute top-2.5 left-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 text-brand backdrop-blur-xs shadow-2xs border border-neutral-100">
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          <h3
            className="text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-brand transition-colors cursor-pointer"
            onClick={() => onQuickView?.(product)}
            title={product.title}
          >
            {product.title}
          </h3>

          {cleanDescription && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {cleanDescription}
            </p>
          )}
        </div>
      </div>

      {/* Bottom: Pricing, Quantity & Add to Cart Button */}
      <div className="pt-4 mt-3 border-t border-neutral-100 space-y-3">
        {/* Pricing & VAT */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-extrabold text-neutral-900 tracking-tight">
              {formattedPrice}
            </span>
            {product.vatRate && (
              <span className="block text-[10px] text-neutral-400">
                Incl. {product.vatRate}% VAT
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

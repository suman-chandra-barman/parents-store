"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { CartItemCard } from "./CartItemCard";
import { CartVoucherCard } from "./CartVoucherCard";
import { CartSummaryCard } from "./CartSummaryCard";
import { CartEmptyState } from "./CartEmptyState";

export function CartContent() {
  const router = useRouter();
  const t = useTranslations("Cart");
  const { cart, itemCount, isLoading, clearCart } = useCart();

  const getTranslation = (key: string, fallback: string) => {
    try {
      if (typeof t.has === "function" && t.has(key)) {
        return t(key);
      }
      const val = t(key);
      if (val && !val.includes("Cart.") && !val.includes("CART.")) {
        return val;
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  const titleText = getTranslation("title", "Shopping Cart");
  const subtitleText = getTranslation(
    "subtitle",
    "Review your selected photo prints, products, and gift vouchers before checkout.",
  );

  if (isLoading && !cart) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-neutral-50/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-neutral-400">
          <Loader2 className="size-8 animate-spin text-brand mb-3" />
          <p className="text-sm font-medium">Loading your shopping cart...</p>
        </div>
      </div>
    );
  }

  const isCartEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50/50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl">
        {/* Consistent Standard Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {titleText} {!isCartEmpty && `(${itemCount})`}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              {subtitleText}
            </p>
          </div>

          {!isCartEmpty && cart.items.length > 1 && (
            <button
              type="button"
              onClick={() => clearCart()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-red-600 transition-colors w-fit cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        {isCartEmpty ? (
          <CartEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {cart.items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Right Column: Voucher & Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
              <CartVoucherCard />
              <CartSummaryCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

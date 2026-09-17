"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { CartItemCard } from "./CartItemCard";
import { CartVoucherCard } from "./CartVoucherCard";
import { CartSummaryCard } from "./CartSummaryCard";
import { CartEmptyState } from "./CartEmptyState";

export function CartContent() {
  const router = useRouter();
  const { cart, itemCount, isLoading, clearCart } = useCart();

  if (isLoading && !cart) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="size-8 animate-spin text-brand mb-3" />
        <p className="text-sm font-medium">Loading your shopping cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Continue Shopping</span>
          </button>
          <span className="text-neutral-300">/</span>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Cart ({itemCount})
          </h1>
        </div>

        {cart.items.length > 1 && (
          <button
            type="button"
            onClick={() => clearCart()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-red-600 transition-colors w-fit"
          >
            <Trash2 className="size-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* Main Grid: Left Items, Right Voucher & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
    </div>
  );
}

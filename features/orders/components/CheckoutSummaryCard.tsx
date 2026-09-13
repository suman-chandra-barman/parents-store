"use client";

import React from "react";
import Image from "next/image";
import { Loader2, Lock, ShoppingBag, Frame } from "lucide-react";
import { useCart } from "@/features/cart/hooks/useCart";
import { cn } from "@/lib/utils";

interface CheckoutSummaryCardProps {
  isSubmitting: boolean;
}

export function CheckoutSummaryCard({ isSubmitting }: CheckoutSummaryCardProps) {
  const { cart } = useCart();

  const items = cart?.items || [];
  const subtotalPrice = parseFloat(cart?.subtotalPrice || "0");
  const shippingPrice = parseFloat(cart?.shippingPrice || "0");
  const discountPrice = parseFloat(cart?.discountPrice || "0");
  const totalPrice = parseFloat(cart?.totalPrice || "0");

  const formattedTotal = `€${totalPrice.toFixed(2)}`;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <h3 className="text-base font-bold text-neutral-900">Your Order</h3>
        <span className="text-xs text-neutral-500 font-medium">
          {items.length} {items.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Mini Items List */}
      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
        {items.map((item) => {
          const photoUrl = item.photos?.[0]?.media?.url;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0"
            >
              <div className="relative size-12 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={item.title || "Order item"}
                    fill
                    sizes="48px"
                    className="object-cover pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <div className="flex items-center justify-center size-full text-neutral-400">
                    <Frame className="size-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-neutral-800 truncate">
                  {item.title || "Cart Item"}
                </p>
                <p className="text-[11px] text-neutral-400">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="text-xs font-bold text-neutral-900 shrink-0">
                €{parseFloat(item.lineTotal || "0").toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
        <div className="flex justify-between">
          <span className="text-neutral-500">Subtotal</span>
          <span className="font-semibold text-neutral-800">
            €{subtotalPrice.toFixed(2)}
          </span>
        </div>

        {shippingPrice > 0 && (
          <div className="flex justify-between">
            <span className="text-neutral-500">Shipping</span>
            <span className="font-semibold text-neutral-800">
              €{shippingPrice.toFixed(2)}
            </span>
          </div>
        )}

        {discountPrice > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Voucher Discount</span>
            <span className="font-semibold">-€{discountPrice.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100">
          <div>
            <span className="text-sm font-bold text-neutral-900 block">
              Total
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              ( Including VAT )
            </span>
          </div>
          <span className="text-xl font-black text-neutral-900 tracking-tight">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || items.length === 0}
        className={cn(
          "w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-[#2060b0] hover:bg-[#1a4f94] active:scale-98 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin text-white" />
        ) : (
          <Lock className="size-4" />
        )}
        <span>Place Order {formattedTotal}</span>
      </button>

      <p className="text-[11px] text-center text-neutral-400">
        🔒 Safe & Secure Checkout
      </p>
    </div>
  );
}

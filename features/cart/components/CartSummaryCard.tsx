"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useCart } from "../hooks/useCart";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface CartSummaryCardProps {
  onProceedToCheckout?: () => void;
}

export function CartSummaryCard({
  onProceedToCheckout,
}: CartSummaryCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const { cart } = useCart();

  const subtotalPrice = parseFloat(cart?.subtotalPrice || "0");
  const shippingPrice = parseFloat(cart?.shippingPrice || "0");
  const discountPrice = parseFloat(cart?.discountPrice || "0");
  const totalPrice = parseFloat(cart?.totalPrice || "0");

  const formattedTotal = `€${totalPrice.toFixed(2)}`;

  const handleProceed = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
      return;
    }
    router.push(`/${locale}/checkout`);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header & Total */}
      <div className="flex items-baseline justify-between gap-2 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-neutral-900">
            Total
          </h3>
          <span className="text-[11px] text-neutral-400 font-medium">
            ( Including VAT )
          </span>
        </div>

        <div className="text-right">
          <span className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Breakdown Details if available */}
      {(subtotalPrice > 0 || shippingPrice > 0 || discountPrice > 0) && (
        <div className="space-y-2 text-xs text-neutral-600 border-b border-neutral-100 pb-4">
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
              <span className="font-semibold">
                -€{discountPrice.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div>
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-brand hover:opacity-90 active:scale-98 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Proceed to checkout</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

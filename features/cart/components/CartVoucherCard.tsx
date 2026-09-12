"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ticket, X, Check, Loader2, Sparkles } from "lucide-react";
import { useCart } from "../hooks/useCart";
import {
  ApplyGiftVoucherFormData,
  ApplyGiftVoucherSchema,
} from "../schemas/cart-schemas";
import { cn } from "@/lib/utils";

export function CartVoucherCard() {
  const {
    cart,
    applyVoucher,
    removeVoucher,
    isApplyingVoucher,
    isRemovingVoucher,
  } = useCart();

  const appliedVoucher = cart?.giftVoucherCode;
  const appliedVoucherCode =
    appliedVoucher?.code || cart?.giftVoucherCodeId || null;
  const discountPrice = parseFloat(cart?.discountPrice || "0");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyGiftVoucherFormData>({
    resolver: zodResolver(ApplyGiftVoucherSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: ApplyGiftVoucherFormData) => {
    try {
      await applyVoucher(data.code);
      reset();
    } catch {
      // Error handled by CartContext toast
    }
  };

  const handleRemove = async () => {
    try {
      await removeVoucher();
    } catch {
      // Error handled by CartContext toast
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-bold text-neutral-900">
          Redeemed voucher
        </h3>
      </div>

      {appliedVoucherCode ? (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Check className="size-4 stroke-[3]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-900 truncate uppercase">
                {appliedVoucherCode}
              </p>
              {discountPrice > 0 && (
                <p className="text-[11px] font-semibold text-emerald-700">
                  -€{discountPrice.toFixed(2)} applied
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemovingVoucher}
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Remove voucher"
          >
            {isRemovingVoucher ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
            <span>Remove</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Voucher code (e.g. GV-XXXX-XXXX-XXXX-XXXX)"
              {...register("code")}
              disabled={isApplyingVoucher}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all uppercase",
                errors.code
                  ? "border-red-400 ring-1 ring-red-200"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            />
            <button
              type="submit"
              disabled={isApplyingVoucher}
              className="px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#2060b0] hover:bg-[#1a4f94] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isApplyingVoucher ? (
                <Loader2 className="size-4 animate-spin text-white" />
              ) : (
                <span>Apply</span>
              )}
            </button>
          </div>

          {errors.code && (
            <p className="text-[11px] text-red-500 font-medium px-1">
              {errors.code.message}
            </p>
          )}
        </form>
      )}

      <p className="text-[11px] text-neutral-400 leading-tight">
        Discount can&apos;t be combined
      </p>
    </div>
  );
}

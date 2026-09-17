"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormData } from "../schemas/checkout-schemas";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  form: UseFormReturn<CheckoutFormData>;
}

export function PaymentMethodSelector({ form }: PaymentMethodSelectorProps) {
  const { register, watch, setValue } = form;
  const paymentMethod = watch("paymentMethod");

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-5">
      <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
        Payment Method
      </h3>

      <div className="space-y-3">
        {/* Option 1: PayPal */}
        <div
          onClick={() => setValue("paymentMethod", "PAYPAL")}
          className={cn(
            "p-4 rounded-xl border transition-all cursor-pointer",
            paymentMethod === "PAYPAL"
              ? "border-brand bg-brand/5 ring-1 ring-brand/30"
              : "border-neutral-200 hover:border-neutral-300"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                value="PAYPAL"
                {...register("paymentMethod")}
                checked={paymentMethod === "PAYPAL"}
                className="size-4 text-brand border-neutral-300 focus:ring-brand"
              />
              <div>
                <span className="text-sm font-bold text-neutral-900 block">
                  PayPal
                </span>
                <span className="text-xs text-neutral-500">
                  You will be redirected to the PayPal website after submitting
                  your order
                </span>
              </div>
            </div>

            <div className="shrink-0 font-black italic text-blue-800 text-sm bg-blue-100/80 px-2 py-0.5 rounded-md border border-blue-200">
              PayPal
            </div>
          </div>
        </div>

        {/* Option 2: Credit Card */}
        <div
          onClick={() => setValue("paymentMethod", "CREDIT_CARD")}
          className={cn(
            "p-4 rounded-xl border transition-all cursor-pointer space-y-4",
            paymentMethod === "CREDIT_CARD"
              ? "border-brand bg-brand/5 ring-1 ring-brand/30"
              : "border-neutral-200 hover:border-neutral-300"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                value="CREDIT_CARD"
                {...register("paymentMethod")}
                checked={paymentMethod === "CREDIT_CARD"}
                className="size-4 text-brand border-neutral-300 focus:ring-brand"
              />
              <span className="text-sm font-bold text-neutral-900">
                Pay with Credit Card
              </span>
            </div>

            {/* Card logos badges */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-100 text-blue-900 rounded-sm border border-neutral-200">
                VISA
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-100 text-orange-700 rounded-sm border border-neutral-200">
                MC
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-100 text-blue-600 rounded-sm border border-neutral-200">
                AMEX
              </span>
            </div>
          </div>

          {/* Credit Card inputs if selected */}
          {paymentMethod === "CREDIT_CARD" && (
            <div className="pt-2 border-t border-neutral-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
              <div className="sm:col-span-3">
                <label className="text-[11px] font-semibold text-neutral-600 mb-1 block">
                  Card number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <CreditCard className="size-4 absolute left-2.5 top-2.5 text-neutral-400" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-neutral-600 mb-1 block">
                  Expiration Date
                </label>
                <input
                  type="text"
                  placeholder="MM / YY"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 mb-1 block">
                  CVC / CVV
                </label>
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

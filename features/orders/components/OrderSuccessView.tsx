"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { OrderCreatedData } from "../types/orders";

interface OrderSuccessViewProps {
  orderData: OrderCreatedData;
}

export function OrderSuccessView({ orderData }: OrderSuccessViewProps) {
  const locale = useLocale();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center max-w-xl animate-in fade-in zoom-in-95 duration-300">
      <div className="size-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-xs">
        <CheckCircle2 className="size-10 stroke-[2]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mb-2">
        Order Placed Successfully!
      </h1>
      <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
        Thank you for your order! We have received your request and will begin
        processing your photos immediately.
      </p>

      {/* Order Info Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-xs text-left space-y-4 mb-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <span className="text-xs text-neutral-500 font-medium">
            Order Number
          </span>
          <span className="text-sm font-bold text-neutral-900 font-mono">
            {orderData.slug || `#${orderData.id}`}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <span className="text-xs text-neutral-500 font-medium">
            Total Amount
          </span>
          <span className="text-base font-extrabold text-[#2060b0]">
            €{parseFloat(orderData.totalPrice || "0").toFixed(2)}
          </span>
        </div>

        {orderData.billingAddress && (
          <div className="pt-1">
            <span className="text-xs text-neutral-500 font-medium block mb-1">
              Billing To
            </span>
            <p className="text-xs font-semibold text-neutral-800">
              {orderData.billingAddress.firstName}{" "}
              {orderData.billingAddress.lastName || ""}
            </p>
            <p className="text-xs text-neutral-500">
              {orderData.billingAddress.location.addressLine1},{" "}
              {orderData.billingAddress.location.city},{" "}
              {orderData.billingAddress.location.country}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/${locale}/photo-galleries/access-cards`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#2060b0] hover:bg-[#1a4f94] shadow-xs text-sm transition-all active:scale-98"
        >
          <ArrowLeft className="size-4" />
          <span>Return to Gallery</span>
        </Link>
      </div>
    </div>
  );
}

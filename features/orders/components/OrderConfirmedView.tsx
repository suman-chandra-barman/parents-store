"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Check, Mail, Download, ArrowLeft } from "lucide-react";
import { SAMPLE_CHILDREN } from "@/features/access-cards/utils/sampleGalleryData";

export interface OrderConfirmedViewProps {
  orderNumber?: string;
  totalPaid?: string;
  deliveryDays?: string;
  recipientName?: string;
  addressLine?: string;
  zipCode?: string;
  city?: string;
  onDownloadFiles?: () => void;
}

export function OrderConfirmedView({
  orderNumber = "#SSP-78394-GER",
  totalPaid = "€89.00",
  deliveryDays = "5-7 Business Days",
  recipientName = "Jane Doe",
  addressLine = "123 Sunnyside Lane",
  zipCode = "10115",
  city = "Berlin",
  onDownloadFiles,
}: OrderConfirmedViewProps) {
  const locale = useLocale();
  const emma = SAMPLE_CHILDREN.Emma;
  const noah = SAMPLE_CHILDREN.Noah;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: Order Details & Shipping Details ── */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          {/* Order Details Card */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-5">
            <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Order Details
            </h2>

            {/* Child 1: Emma's Packages */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <div className="relative size-5 rounded-full overflow-hidden border border-neutral-200">
                  <Image
                    src={emma.avatarUrl}
                    alt="Emma"
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
                <span>Emma&apos;s Packages</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-2 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=120&q=80"
                      alt="Savings Bundle"
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-700 leading-snug">
                    Savings Bundle (1 Poster, 3 Prints, 2 Digital)
                  </span>
                </div>
                <span className="text-sm font-extrabold text-neutral-900 shrink-0">
                  €49.00
                </span>
              </div>
            </div>

            {/* Child 2: Noah's Packages */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <div className="relative size-5 rounded-full overflow-hidden border border-neutral-200">
                  <Image
                    src={noah.avatarUrl}
                    alt="Noah"
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
                <span>Noah&apos;s Packages</span>
              </div>

              <div className="flex items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80"
                      alt="Digital Downloads"
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-700 leading-snug">
                    Digital Downloads Pack Only
                  </span>
                </div>
                <span className="text-sm font-extrabold text-neutral-900 shrink-0">
                  €40.00
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Details Card */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Shipping Details
            </h2>

            <div className="space-y-3">
              <div className="rounded-2xl bg-[#FAF9F5] border border-neutral-200/60 px-4 py-3 text-xs font-semibold text-neutral-800">
                {recipientName}
              </div>
              <div className="rounded-2xl bg-[#FAF9F5] border border-neutral-200/60 px-4 py-3 text-xs font-semibold text-neutral-800">
                {addressLine}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#FAF9F5] border border-neutral-200/60 px-4 py-3 text-xs font-semibold text-neutral-800">
                  {zipCode}
                </div>
                <div className="rounded-2xl bg-[#FAF9F5] border border-neutral-200/60 px-4 py-3 text-xs font-semibold text-neutral-800">
                  {city}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Order Confirmed Card ── */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs text-center space-y-6">
          {/* Big Green Check Circle */}
          <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
            <Check className="size-8 stroke-[3]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              Order Confirmed!
            </h2>
            <p className="text-xs text-neutral-400 font-medium">
              Sent to high-res physical production.
            </p>
          </div>

          {/* Summary Box */}
          <div className="rounded-2xl bg-[#FAF9F5] border border-neutral-200/60 p-4.5 text-xs space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Order Number</span>
              <span className="font-extrabold text-neutral-900 tracking-wider">
                {orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Total Paid</span>
              <span className="font-extrabold text-neutral-900 text-sm">
                {totalPaid}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-medium">Est. Delivery</span>
              <span className="font-extrabold text-emerald-600">
                {deliveryDays}
              </span>
            </div>
          </div>

          {/* Email Notice Box */}
          <div className="rounded-2xl bg-[#FFF5F2] border border-[#FFD8CD] p-3.5 flex items-center gap-3 text-xs text-neutral-700 text-left">
            <Mail className="size-4.5 text-[#FF5A36] shrink-0" />
            <span className="font-medium leading-relaxed">
              Receipt and tracking details were dispatched to your email.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={onDownloadFiles}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#FF5A36] hover:bg-[#E84A26] active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#FF5A36]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="size-4" />
              <span>Download Digital Files</span>
            </button>

            <Link
              href={`/${locale}/photo-galleries/access-cards`}
              className="w-full py-3.5 px-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 active:scale-98 text-neutral-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Portal Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

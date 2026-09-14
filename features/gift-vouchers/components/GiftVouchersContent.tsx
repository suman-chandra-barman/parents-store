"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, Gift, RefreshCw } from "lucide-react";
import { useGetGiftVouchersQuery } from "../api/giftVouchersApi";
import { GiftVoucherItem } from "../types/gift-vouchers";
import { GiftVoucherCard } from "./GiftVoucherCard";
import { GiftVoucherQuickViewModal } from "./GiftVoucherQuickViewModal";
import { GiftVoucherListSkeleton } from "./GiftVoucherListSkeleton";
import { useTenantStore } from "@/stores/useTenantStore";

export function GiftVouchersContent() {
  const locale = useLocale();
  const tenant = useTenantStore((state) => state.tenant);
  const isTenantLoading = useTenantStore((state) => state.isLoading);

  const [quickViewVoucher, setQuickViewVoucher] = useState<GiftVoucherItem | null>(null);

  const {
    data: vouchers = [],
    isLoading: isQueryLoading,
    isFetching,
    error,
    refetch,
  } = useGetGiftVouchersQuery(undefined, {
    skip: !tenant?.id,
  });

  const isLoading = (!tenant?.id && isTenantLoading) || isQueryLoading || isFetching;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50/50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">
        {/* Header and Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Home</span>
              </Link>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-800 font-semibold">Gift Vouchers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Gift Vouchers & Celebration Cards
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Give the gift of timeless memories. Purchase vouchers redeemable for photo sessions, prints, and packages.
            </p>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <GiftVoucherListSkeleton />
        ) : error ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-red-100 p-8 shadow-xs max-w-lg mx-auto space-y-4">
            <p className="text-sm text-red-600 font-semibold">
              Failed to load gift vouchers. Please check your connection.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs max-w-md mx-auto space-y-4">
            <div className="size-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto text-amber-600">
              <Gift className="size-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-800">
                No gift vouchers found
              </h3>
              <p className="text-xs text-neutral-500">
                There are currently no gift vouchers available in the store.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {vouchers.map((voucher) => (
              <GiftVoucherCard
                key={voucher.id}
                voucher={voucher}
                onQuickView={(v) => setQuickViewVoucher(v)}
              />
            ))}
          </div>
        )}

        {/* Quick View Modal */}
        <GiftVoucherQuickViewModal
          voucher={quickViewVoucher}
          isOpen={!!quickViewVoucher}
          onClose={() => setQuickViewVoucher(null)}
        />
      </div>
    </div>
  );
}

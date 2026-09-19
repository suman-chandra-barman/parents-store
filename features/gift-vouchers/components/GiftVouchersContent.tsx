"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Gift } from "lucide-react";
import { useGetGiftVouchersQuery } from "../api/giftVouchersApi";
import { GiftVoucherItem } from "../types/gift-vouchers";
import { GiftVoucherCard } from "./GiftVoucherCard";
import { GiftVoucherQuickViewModal } from "./GiftVoucherQuickViewModal";
import { GiftVoucherListSkeleton } from "./GiftVoucherListSkeleton";
import { useTenantStore } from "@/stores/useTenantStore";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";

export function GiftVouchersContent() {
  const t = useTranslations("GiftVouchers");
  const tenant = useTenantStore((state) => state.tenant);
  const isTenantLoading = useTenantStore((state) => state.isLoading);

  const [quickViewVoucher, setQuickViewVoucher] = useState<GiftVoucherItem | null>(null);

  const isTenantReady = Boolean(tenant?.id);

  const {
    data: vouchers = [],
    isLoading: isQueryLoading,
    isFetching,
    error,
    refetch,
  } = useGetGiftVouchersQuery(undefined, {
    skip: !isTenantReady,
  });

  const isLoading = !isTenantReady || isTenantLoading || isQueryLoading || isFetching;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50/50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {t("title")}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <GiftVoucherListSkeleton />
        ) : error ? (
          <ErrorState
            message={t("failedToLoad")}
            onRetry={() => refetch()}
            retryText={t("retry")}
          />
        ) : vouchers.length === 0 ? (
          <EmptyState
            icon={
              <div className="size-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Gift className="size-8 stroke-[1.5]" />
              </div>
            }
            title={t("noVouchersFound")}
            description={t("noVouchersDesc")}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-200">
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


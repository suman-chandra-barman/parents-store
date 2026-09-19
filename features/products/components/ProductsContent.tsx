"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, PackageOpen } from "lucide-react";
import { useGetProductsQuery } from "../api/productsApi";
import { ProductItem } from "../types/products";
import { ProductCard } from "./ProductCard";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { ProductListSkeleton } from "./ProductListSkeleton";
import { useTenantStore } from "@/stores/useTenantStore";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";

export function ProductsContent() {
  const t = useTranslations("Products");
  const locale = useLocale();
  const tenant = useTenantStore((state) => state.tenant);
  const isTenantLoading = useTenantStore((state) => state.isLoading);

  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  const isTenantReady = Boolean(tenant?.id);

  const {
    data: products = [],
    isLoading: isQueryLoading,
    isFetching,
    error,
    refetch,
  } = useGetProductsQuery(undefined, {
    skip: !isTenantReady,
  });

  const isLoading = !isTenantReady || isTenantLoading || isQueryLoading || isFetching;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50/50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
              <span className="text-neutral-800 font-semibold">{t("title")}</span>
            </div>
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
          <ProductListSkeleton />
        ) : error ? (
          <ErrorState
            message={t("failedToLoad")}
            onRetry={() => refetch()}
            retryText={t("retry")}
          />
        ) : products.length === 0 ? (
          <EmptyState
            icon={
              <div className="size-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                <PackageOpen className="size-8 stroke-[1.5]" />
              </div>
            }
            title={t("noProductsFound")}
            description={t("noProductsDesc")}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-200">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Quick View Modal */}
        <ProductQuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </div>
  );
}


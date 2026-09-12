"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, Heart, Loader2, PackageOpen } from "lucide-react";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";
import { useGetPackagesByPhotoIdsQuery } from "../api/paperFormatsApi";
import { PaperFormatItem } from "../types/paper-formats";
import { PackageCard } from "./PackageCard";
import { PackageCustomizerView } from "./PackageCustomizerView";
import { Button } from "@/components/ui/button";
import { useTenantStore } from "@/stores/useTenantStore";

export function PackagesContent() {
  const locale = useLocale();
  const tenant = useTenantStore((state) => state.tenant);
  const isTenantLoading = useTenantStore((state) => state.isLoading);
  const { favoriteIds } = useFavorites();
  const [selectedPackage, setSelectedPackage] =
    useState<PaperFormatItem | null>(null);

  const {
    data: packages = [],
    isLoading: isQueryLoading,
    isFetching,
    error,
  } = useGetPackagesByPhotoIdsQuery(
    { photoIds: favoriteIds },
    {
      skip: favoriteIds.length === 0 || !tenant?.id,
    }
  );

  const isLoading =
    (favoriteIds.length > 0 && !tenant?.id) ||
    isTenantLoading ||
    isQueryLoading ||
    isFetching;

  // If no favorite photos have been selected yet
  if (favoriteIds.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="size-20 rounded-3xl bg-pink-50 border border-pink-100 flex items-center justify-center mx-auto mb-6 text-pink-500 shadow-xs">
          <Heart className="size-10 stroke-[1.5]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
          No Favorite Photos Selected
        </h2>
        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
          Please favorite at least one photo from your gallery to view and order
          custom photography packages.
        </p>
        <Link
          href={`/${locale}/photo-galleries/access-cards`}
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white bg-[#2060b0] hover:bg-[#1a4f94] shadow-xs text-sm transition-all active:scale-98"
        >
          Back to Photo Gallery
        </Link>
      </div>
    );
  }

  // If customizer view is active for a selected package
  if (selectedPackage) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <PackageCustomizerView
          packageItem={selectedPackage}
          favoriteIds={favoriteIds}
          onBack={() => setSelectedPackage(null)}
        />
      </div>
    );
  }

  // Packages List View ("Choose a package")
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/photo-galleries/access-cards`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Gallery</span>
          </Link>
          <span className="text-neutral-300">/</span>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
            Choose a package
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 bg-neutral-100/80 px-3 py-1.5 rounded-lg w-fit">
          <Heart className="size-3.5 fill-red-500 text-red-500" />
          <span>{favoriteIds.length} Favorites Selected</span>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-neutral-400">
          <Loader2 className="size-8 animate-spin text-[#2060b0] mb-3" />
          <p className="text-sm font-medium">Finding eligible packages for your photos...</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-red-100 p-8 shadow-xs">
          <p className="text-sm text-red-600 font-semibold mb-4">
            Failed to load packages for your selected photos.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            Try Again
          </Button>
        </div>
      ) : packages.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-xs">
          <PackageOpen className="size-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800 mb-1">
            No Packages Available
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mb-6">
            There are currently no package formats available for the photos you
            have selected.
          </p>
          <Link
            href={`/${locale}/photo-galleries/access-cards`}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Return to Gallery
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              packageItem={pkg}
              onViewPackage={(item) => setSelectedPackage(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";
import { useCart } from "@/features/cart/hooks/useCart";
import { useGetPackagesByPhotoIdsQuery } from "../api/paperFormatsApi";
import { useTenantStore } from "@/stores/useTenantStore";
import { FavoritesSummaryHeader } from "./FavoritesSummaryHeader";
import { PackageSelectionGrid } from "./PackageSelectionGrid";
import { ConfigureBundleView } from "./ConfigureBundleView";

export function PackagesContent() {
  const router = useRouter();
  const locale = useLocale();
  const tenant = useTenantStore((state) => state.tenant);
  const { favoriteIds } = useFavorites();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const [isConfiguringBundle, setIsConfiguringBundle] = useState<boolean>(() => {
    return searchParams?.get("bundle") === "savings";
  });

  const { data: apiPackages = [] } = useGetPackagesByPhotoIdsQuery(
    { photoIds: favoriteIds },
    {
      skip: favoriteIds.length === 0 || !tenant?.id,
    },
  );

  const handleSelectPrints = () => {
    setIsConfiguringBundle(true);
    router.replace(`/${locale}/photo-galleries/packages?bundle=savings`);
  };

  const handleSelectAllDigital = async () => {
    try {
      await addToCart({
        kind: "PHOTO",
        formatId: "all-photos-digital",
        quantity: 1,
        photoIds: favoriteIds.length > 0 ? favoriteIds : ["emma-photo-1", "noah-photo-1"],
      });
      router.push(`/${locale}/checkout`);
    } catch {
      router.push(`/${locale}/checkout`);
    }
  };

  const handleConfigureBundle = () => {
    setIsConfiguringBundle(true);
    router.replace(`/${locale}/photo-galleries/packages?bundle=savings`);
  };

  // STEP 4: Configure Bundle View
  if (isConfiguringBundle) {
    return (
      <main className="min-h-screen bg-[#FAF9F5] py-8 px-4 sm:px-6 lg:px-8">
        <ConfigureBundleView
          onBack={() => {
            setIsConfiguringBundle(false);
            router.replace(`/${locale}/photo-galleries/packages`);
          }}
        />
      </main>
    );
  }

  // STEP 3: Package Selection View
  return (
    <main className="min-h-screen bg-[#FAF9F5] py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Favorites Summary Banner */}
      <FavoritesSummaryHeader favoriteIds={favoriteIds} />

      {/* 3 Package Cards */}
      <PackageSelectionGrid
        onSelectPrints={handleSelectPrints}
        onSelectAllDigital={handleSelectAllDigital}
        onConfigureBundle={handleConfigureBundle}
        packages={apiPackages}
      />
    </main>
  );
}

export default PackagesContent;

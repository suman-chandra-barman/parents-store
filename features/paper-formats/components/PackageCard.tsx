"use client";

import Image from "next/image";
import { Frame, ArrowRight } from "lucide-react";
import { PaperFormatItem } from "../types/paper-formats";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  packageItem: PaperFormatItem;
  onViewPackage: (packageItem: PaperFormatItem) => void;
}

export function PackageCard({
  packageItem,
  onViewPackage,
}: PackageCardProps) {
  const priceObj =
    packageItem.prices?.find((p) => p.isDefault) || packageItem.prices?.[0];
  const rawPrice = priceObj
    ? priceObj.price
    : packageItem.oneOffCost || "128.43";
  const numericPrice = parseFloat(rawPrice) || 0;
  const formattedPrice = `€${numericPrice.toFixed(2)}`;

  const previewImageUrl =
    packageItem.size?.preview?.[0]?.url || packageItem.size?.previews?.[0]?.url;

  const photosCountText = packageItem.packages?.length
    ? `${packageItem.packages.length} photo items included`
    : packageItem.description
      ? packageItem.description.replace(/<[^>]*>?/gm, "")
      : "Digital & print package";

  return (
    <div className="group relative bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between">
      {/* Left side: Image and details */}
      <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
        {/* Mockup Frame Thumbnail */}
        <div className="relative shrink-0 w-24 h-32 sm:w-32 sm:h-40 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center shadow-xs">
          {previewImageUrl ? (
            <Image
              src={previewImageUrl}
              alt={packageItem.title}
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400 p-2 text-center">
              <Frame className="size-8 mb-1.5 text-neutral-400" />
              <span className="text-[10px] font-mono leading-tight text-neutral-500">
                {packageItem.size?.title || "Package"}
              </span>
            </div>
          )}
        </div>

        {/* Center: Package Details */}
        <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 truncate">
            {packageItem.title}
          </h3>

          {/* Subtitle / Digital photos count */}
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            {photosCountText}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1 border-b border-neutral-100 pb-2">
            <span className="text-base sm:text-lg md:text-xl font-extrabold text-neutral-900 tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <p className="text-[10px] sm:text-[11px] text-neutral-400">
            VAT Included, postage calculated at checkout.
          </p>
        </div>
      </div>

      {/* Right side: View package action button */}
      <div className="flex items-center justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
        <button
          type="button"
          onClick={() => onViewPackage(packageItem)}
          className={cn(
            "w-full md:w-auto px-6 sm:px-8 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer",
            "bg-[#2060b0] hover:bg-[#1a4f94] active:scale-98"
          )}
        >
          <span>View package</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

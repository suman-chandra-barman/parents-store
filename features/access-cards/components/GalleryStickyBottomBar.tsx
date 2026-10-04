"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Heart, ArrowRight } from "lucide-react";

export interface GalleryStickyBottomBarProps {
  favoriteCount: number;
}

export function GalleryStickyBottomBar({
  favoriteCount,
}: GalleryStickyBottomBarProps) {
  const locale = useLocale();

  return (
    <aside
      aria-label="Favorites summary"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 py-3.5 px-4 sm:px-8 shadow-lg animate-in slide-in-from-bottom duration-300"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Left: Favorites Count Indicator */}
        <div className="flex items-center gap-3.5">
          <div className="size-11 sm:size-12 rounded-2xl bg-[#FFF2EE] border border-[#FFDCD3] flex items-center justify-center text-[#FF5A36] shadow-2xs">
            <Heart className="size-5 sm:size-6 fill-[#FF5A36]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-neutral-900 tracking-tight">
              {favoriteCount > 0
                ? `${favoriteCount} Favorites Selected`
                : "No Favorites Selected Yet"}
            </h2>
            <p className="text-xs text-neutral-400 font-medium hidden sm:block">
              Combine them into digital or print packages next!
            </p>
          </div>
        </div>

        {/* Right: Continue to Packages Button */}
        <Link
          href={`/${locale}/photo-galleries/packages`}
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-[#FF5A36] hover:bg-[#E84A26] active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#FF5A36]/25 transition-all cursor-pointer"
        >
          <span>Continue to Packages</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </aside>
  );
}

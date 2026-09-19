"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, KeyRound, Images } from "lucide-react";

export function FavoritesEmptyState() {
  const locale = useLocale();
  const t = useTranslations("Favorites");

  return (
    <div className="py-16 sm:py-20 px-4 text-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="size-16 sm:size-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-5 text-rose-500 shadow-xs">
        <Heart className="size-8 sm:size-10 stroke-[1.5]" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2 tracking-tight">
        {t("emptyTitle")}
      </h2>

      <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed mb-8">
        {t("emptyDesc")}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/${locale}/photo-galleries/access-cards`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-brand hover:opacity-95 shadow-sm transition-all active:scale-98 cursor-pointer"
        >
          <KeyRound className="size-4" />
          <span>{t("goToAccessCards")}</span>
        </Link>

        <Link
          href={`/${locale}/public-galleries`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 transition-all active:scale-98 cursor-pointer"
        >
          <Images className="size-4" />
          <span>{t("goToPublicGalleries")}</span>
        </Link>
      </div>
    </div>
  );
}


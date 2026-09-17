"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, KeyRound, Images } from "lucide-react";

export function FavoritesEmptyState() {
  const locale = useLocale();
  const t = useTranslations("Favorites");

  return (
    <div className="py-20 px-4 text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="size-20 rounded-3xl bg-rose-50 border border-rose-100/80 flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-xs">
        <Heart className="size-10 stroke-[1.5]" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2.5 tracking-tight">
        {t("emptyTitle")}
      </h2>

      <p className="text-xs sm:text-sm text-muted-foreground mb-8 leading-relaxed">
        {t("emptyDesc")}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/${locale}/photo-galleries/access-cards`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-brand hover:opacity-90 shadow-sm text-xs transition-all active:scale-98"
        >
          <KeyRound className="size-4" />
          <span>{t("goToAccessCards")}</span>
        </Link>

        <Link
          href={`/${locale}/public-galleries`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-foreground bg-muted/60 hover:bg-muted border border-border text-xs transition-all active:scale-98"
        >
          <Images className="size-4" />
          <span>{t("goToPublicGalleries")}</span>
        </Link>
      </div>
    </div>
  );
}

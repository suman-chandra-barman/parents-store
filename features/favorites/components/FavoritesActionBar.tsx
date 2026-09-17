"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Package, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FavoritesActionBarProps {
  favoriteCount: number;
  onClearAll: () => void;
}

export function FavoritesActionBar({
  favoriteCount,
  onClearAll,
}: FavoritesActionBarProps) {
  const locale = useLocale();
  const t = useTranslations("Favorites");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (favoriteCount === 0) return null;

  return (
    <div className="sticky top-20 z-20 bg-card/95 backdrop-blur-md border border-border rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 transition-all">
      {/* Left: Summary Count & Clear All */}
      <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold bg-rose-50 border border-rose-100/80 px-3 py-1.5 rounded-xl text-rose-600">
          <Heart className="size-3.5 fill-rose-500 text-rose-500" />
          <span>{t("favoritesCount", { count: favoriteCount })}</span>
        </div>

        {showConfirmClear ? (
          <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
            <span className="text-[11px] text-muted-foreground hidden md:inline">
              {t("clearAllConfirm")}
            </span>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onClearAll();
                setShowConfirmClear(false);
              }}
              className="text-xs h-7 px-2.5 rounded-lg font-semibold"
            >
              {t("clearAll")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmClear(false)}
              className="text-xs h-7 px-2 rounded-lg text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmClear(true)}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>{t("clearAll")}</span>
          </button>
        )}
      </div>

      {/* Right: The Single Primary Action Button */}
      <div className="flex items-center justify-end">
        <Link
          href={`/${locale}/photo-galleries/packages`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-brand hover:opacity-90 shadow-sm transition-all active:scale-98 text-xs sm:text-sm cursor-pointer"
        >
          <Package className="size-4" />
          <span>{t("continueOrdering", { count: favoriteCount })}</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

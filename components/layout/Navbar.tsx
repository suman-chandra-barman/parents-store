"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/features/access-cards/hooks/useFavorites";
import { useCart } from "@/features/cart/hooks/useCart";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PortalStepIndicator } from "./PortalStepIndicator";
import { useTenantStore } from "@/stores/useTenantStore";

export function Navbar() {
  const { tenant } = useTenantStore();
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const { favoriteCount } = useFavorites();
  const { itemCount } = useCart();

  const brandName = tenant?.name || "Sunnyside Portraits";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Subtitle */}
        <div className="shrink-0 flex items-center gap-3">
          <Link
            href={`/${locale}/photo-galleries/access-cards`}
            className="flex items-center gap-3 py-1 group"
          >
            {tenant?.logo ? (
              <Image
                src={tenant.logo.url}
                alt={`Logo of ${brandName}`}
                width={160}
                height={40}
                className="w-auto h-9 object-contain"
              />
            ) : (
              <div className="size-9 rounded-xl bg-[#FFF0EB] border border-[#FFD8CD] flex items-center justify-center text-[#FF5A36] font-extrabold text-lg shadow-2xs group-hover:scale-105 transition-transform">
                <span className="leading-none">☀️</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-neutral-900 leading-tight">
                {brandName}
              </span>
              <span className="text-[11px] font-medium text-neutral-400 leading-tight">
                School Photography Made Simple
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Actions (Favorites, Cart, Language) + Portal Step Indicator */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Favorites */}
          <Link
            href={`/${locale}/favorites`}
            className="relative flex items-center justify-center p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title={t("favorites")}
            aria-label={t("favorites")}
          >
            <Heart
              className={cn(
                "size-5 stroke-[1.8] transition-colors",
                favoriteCount > 0 ? "fill-[#FF5A36] text-[#FF5A36]" : "",
              )}
            />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#FF5A36] text-[10px] font-bold text-white flex items-center justify-center leading-none shadow-xs animate-in zoom-in-50 duration-200">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart */}
          <Link
            href={`/${locale}/cart`}
            className="relative flex items-center justify-center p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label={t("shoppingCart")}
            title={t("shoppingCart")}
          >
            <ShoppingCart className="size-5 stroke-[1.8]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#FF5A36] text-[10px] font-bold text-white flex items-center justify-center leading-none shadow-xs animate-in zoom-in-50 duration-200">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Divider */}
          <div className="hidden md:block h-8 w-px bg-neutral-200" />

          {/* Step Indicator (Desktop) */}
          <div className="hidden sm:block">
            <Suspense fallback={<div className="w-28 h-8" />}>
              <PortalStepIndicator />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Mobile Step Indicator sub-bar */}
      <div className="sm:hidden px-4 py-2 border-t border-neutral-100 flex items-center justify-between bg-[#FAF9F5]/80">
        <Suspense fallback={null}>
          <PortalStepIndicator />
        </Suspense>
      </div>
    </header>
  );
}

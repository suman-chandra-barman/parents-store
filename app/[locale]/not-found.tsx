"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Home,
  Images,
  ShoppingBag,
  Gift,
  Compass,
  ArrowRight,
} from "lucide-react";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const locale = useLocale();

  const quickLinks = [
    {
      href: `/${locale}`,
      label: t("backHome"),
      description: "Return to the main store homepage",
      icon: Home,
      highlight: true,
    },
    {
      href: `/${locale}/photo-galleries/classic`,
      label: t("browseGalleries"),
      description: "Explore open photo collections & albums",
      icon: Images,
    },
    {
      href: `/${locale}/products`,
      label: t("exploreProducts"),
      description: "Browse keepsakes, frames & gear",
      icon: ShoppingBag,
    },
    {
      href: `/${locale}/gift-voucher`,
      label: t("giftVouchers"),
      description: "Order gift cards & celebration vouchers",
      icon: Gift,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-linear-to-b from-neutral-50 via-white to-neutral-50">
      <div className="w-full max-w-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Top Floating Badge & Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute -inset-4 bg-linear-to-r from-brand/20 via-purple-500/20 to-amber-500/20 rounded-full blur-xl opacity-75" />
          <div className="relative size-20 sm:size-24 rounded-3xl bg-white border border-neutral-200/80 shadow-md flex items-center justify-center text-brand">
            <Compass className="size-10 sm:size-12 stroke-[1.5] animate-pulse text-brand" />
          </div>
        </div>

        {/* 404 Heading & Description */}
        <div className="space-y-3">
          <div className="inline-block">
            <span className="text-6xl sm:text-8xl font-black tracking-tight text-neutral-900 bg-linear-to-r from-brand via-purple-600 to-brand bg-clip-text text-transparent select-none">
              {t("code")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {t("title")}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-4 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
            {t("exploreTitle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3.5 p-3.5 rounded-2xl border border-neutral-200/70 hover:border-brand/40 bg-neutral-50/60 hover:bg-brand/5 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className="size-10 rounded-xl bg-white border border-neutral-200/80 text-brand flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-brand group-hover:text-white transition-all shadow-2xs">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-neutral-800 group-hover:text-brand transition-colors">
                        {item.label}
                      </span>
                      <ArrowRight className="size-3.5 text-neutral-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Primary Back to Home button */}
        <div>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-brand hover:opacity-95 active:scale-98 shadow-md transition-all cursor-pointer"
          >
            <Home className="size-4" />
            <span>{t("backHome")}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

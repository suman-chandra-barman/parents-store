"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenantStore } from "@/stores/useTenantStore";

interface PublicGalleryHeroProps {
  totalPhotos: number;
  onExploreClick: () => void;
}

export function PublicGalleryHero({
  totalPhotos,
  onExploreClick,
}: PublicGalleryHeroProps) {
  const tenant = useTenantStore((state) => state.tenant);
  const tHero = useTranslations("HeroSection");
  const t = useTranslations("PublicGalleries");

  const studioName = tenant?.name || "LUMIPHOTO";

  return (
    <section className="relative w-full overflow-hidden bg-[#FBF9F5]">
      <div className="md:h-[calc(100vh-66px)] mx-auto flex flex-col md:flex-row">
        {/* ── LEFT: Text content ── */}
        <div className="relative z-10 flex w-full flex-col justify-center px-6 py-16 sm:px-10 md:w-1/2 md:px-16 lg:px-20">
          {/* Decorative corner shapes */}
          <div
            className="pointer-events-none absolute -left-40 -top-20 h-40 w-56 rounded-full bg-[#E7E4DD]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-48 h-64 w-72 rounded-full bg-[#F6E1C4]"
            aria-hidden="true"
          />

          <div className="relative space-y-6">
            {/* Studio Name */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-widest text-neutral-500 uppercase">
                {studioName}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <Sparkles className="size-3 text-emerald-600" />
                <span>Public Gallery</span>
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-neutral-900 tracking-tight">
                {t("title")}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
                {t("subtitle")}
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 text-xs text-neutral-700 bg-white border border-neutral-200/80 px-3 py-1.5 rounded-xl shadow-xs">
                <Eye className="size-3.5 text-[#2060b0]" />
                <span className="font-medium">{t("freeAccess")}</span>
              </div>
              {totalPhotos > 0 && (
                <div className="inline-flex items-center gap-1.5 text-xs text-neutral-700 bg-white border border-neutral-200/80 px-3 py-1.5 rounded-xl shadow-xs">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="font-medium">
                    {t("photosAvailable", { count: totalPhotos })}
                  </span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                onClick={onExploreClick}
                className="h-12 w-fit rounded-none bg-brand hover:opacity-70 px-8 text-xs font-semibold tracking-widest text-white transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>{t("explorePhotos")}</span>
                <ArrowDown className="size-3.5 animate-bounce" />
              </Button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Full-bleed photographer/hero image ── */}
        <div
          className="hidden md:block relative h-96 w-full md:h-auto md:w-1/2 select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <Image
            src={tenant?.heroImage ? tenant.heroImage.url : "/hero-section.png"}
            alt={tHero("imageAlt")}
            fill
            priority
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="pointer-events-none object-contain object-center md:object-right"
          />
        </div>
      </div>
    </section>
  );
}

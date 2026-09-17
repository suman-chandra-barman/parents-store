"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { X, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenantStore } from "@/stores/useTenantStore";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  accessCodes: string[];
  onAccessCodesChange: (codes: string[]) => void;
  isLoading?: boolean;
  error?: string | null;
  onViewGallery: (codes: string[]) => void;
}

export function HeroSection({
  title,
  subtitle,
  accessCodes,
  onAccessCodesChange,
  isLoading = false,
  error,
  onViewGallery,
}: HeroSectionProps) {
  const tenant = useTenantStore(({ tenant }) => tenant);
  const isTenantLoading = useTenantStore(({ isLoading }) => isLoading);
  const [isImageReady, setIsImageReady] = React.useState(false);

  const t = useTranslations("HeroSection");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayTitle = title ?? t("title");
  const displaySubtitle = subtitle ?? t("subtitle");

  const heroImageUrl =
    tenant?.heroImage?.url || (!isTenantLoading ? "/hero-section.png" : null);

  const addCode = (value: string) => {
    const trimmed = value.trim().toUpperCase();
    if (!trimmed) return;
    if (accessCodes.includes(trimmed)) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    onAccessCodesChange([...accessCodes, trimmed]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeCode = (code: string) => {
    onAccessCodesChange(accessCodes.filter((c) => c !== code));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addCode((e.target as HTMLInputElement).value);
    }
    if (
      e.key === "Backspace" &&
      !(e.target as HTMLInputElement).value &&
      accessCodes.length > 0
    ) {
      onAccessCodesChange(accessCodes.slice(0, -1));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    addCode(e.target.value);
  };

  const handleViewGallery = () => {
    const currentVal = inputRef.current?.value || "";
    let codes = [...accessCodes];
    const trimmed = currentVal.trim().toUpperCase();
    if (trimmed && !codes.includes(trimmed)) {
      codes = [...codes, trimmed];
      onAccessCodesChange(codes);
      if (inputRef.current) inputRef.current.value = "";
    }
    if (codes.length === 0) return;
    onViewGallery(codes);
  };

  const hasAnyCodes = accessCodes.length > 0;

  return (
    <section className="relative w-full overflow-hidden bg-[#FBF9F5]">
      <div className="md:h-[calc(100vh-66px)] mx-auto flex flex-col md:flex-row">
        {/* ── LEFT: Text content ── */}
        <div className="relative z-10 flex w-full flex-col justify-center px-6 py-16 sm:px-10 md:w-[52%] md:px-16 lg:px-20">
          {/* Decorative corner shapes — contained inside left column */}
          <div
            className="pointer-events-none absolute -left-40 -top-20 h-40 w-56 rounded-full bg-[#E7E4DD]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-25 -left-50 h-64 w-72 rounded-full bg-[#F6E1C4]"
            aria-hidden="true"
          />

          <div className="relative">
            {/* LUMIPHOTO eyebrow */}
            <p className="text-xs font-medium tracking-[0.25em] text-neutral-500">
              {displaySubtitle}
            </p>

            {/* Heading */}
            <h1 className="mt-6 text-5xl font-normal leading-[1.05] text-neutral-900 sm:text-6xl lg:text-[64px]">
              {displayTitle}
            </h1>

            {/* Date / subtext */}
            <p className="mt-5 text-xs font-medium tracking-[0.2em] text-neutral-400">
              {t("shotsDetails")}
            </p>

            {/* ── Access Card section ── */}
            <div className="mt-8 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-neutral-600 uppercase">
                {t("withAccessCard")}
              </p>

              {/* Tag-based code input */}
              <div
                onClick={() => inputRef.current?.focus()}
                className="flex flex-wrap items-center gap-1.5 border border-neutral-300 bg-white px-3"
                style={{
                  minHeight: 46,
                  maxWidth: 340,
                  cursor: "text",
                  padding: accessCodes.length > 0 ? "6px 12px" : "0 12px",
                }}
              >
                {/* Code tags */}
                {accessCodes.map((code) => (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 rounded-sm bg-brand hover:opacity-70 px-2 py-0.5 text-[11px] font-semibold text-white"
                    style={{ letterSpacing: "0.06em" }}
                  >
                    {code}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCode(code);
                      }}
                      className="flex items-center text-white/70 hover:text-white"
                      aria-label={t("removeCode", { code })}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}

                {/* Text input */}
                <input
                  ref={inputRef}
                  type="text"
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder={
                    accessCodes.length === 0 ? t("enterCode") : t("addAnother")
                  }
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-center text-xs font-mono text-neutral-700 placeholder:text-neutral-400 focus:outline-none disabled:opacity-50"
                  style={{
                    minWidth: 100,
                    height: accessCodes.length === 0 ? 44 : 26,
                    letterSpacing:
                      accessCodes.length === 0 ? "0.2em" : "0.06em",
                    textAlign: accessCodes.length === 0 ? "center" : "left",
                  }}
                  aria-label="Access card code"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs font-medium text-red-500">{error}</p>
              )}

              {/* Multi-code hint */}
              {accessCodes.length > 0 && (
                <p className="text-[10px] text-neutral-400">
                  {t.rich("multiCodeHint", {
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
              )}
            </div>

            {/* VIEW GALLERY CTA */}
            <Button
              onClick={handleViewGallery}
              disabled={!hasAnyCodes || isLoading}
              className="mt-8 h-12 w-fit rounded-none bg-brand hover:opacity-70 px-8 text-xs font-semibold tracking-[0.2em] text-white hover:bg-[#274d8c] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-2"
            >
              <span>{t("viewGallery")}</span>
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <ArrowRight className="size-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* ── RIGHT: Full-bleed photographer image ── */}
        <div
          className="hidden md:block relative h-100 w-full md:h-auto md:w-[48%] select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt={t("imageAlt")}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 48vw"
              onLoad={() => setIsImageReady(true)}
              className={`pointer-events-none object-contain object-center md:object-right transition-opacity duration-500 ease-out ${
                isImageReady ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </div>
    </section>
  );
}

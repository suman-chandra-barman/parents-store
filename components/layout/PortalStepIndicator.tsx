"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAccessCardsGallery } from "@/features/access-cards/hooks/useAccessCardsGallery";

export interface PortalStepIndicatorProps {
  forcedStep?: number;
}

const STEP_DEFINITIONS = [
  { step: 1, label: "Access Portal" },
  { step: 2, label: "Explore Gallery" },
  { step: 3, label: "Package Selection" },
  { step: 4, label: "Configure Bundle" },
  { step: 5, label: "Checkout" },
  { step: 6, label: "Checkout & Receipt" },
] as const;

export function PortalStepIndicator({ forcedStep }: PortalStepIndicatorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAccessCardsGallery();

  // Determine current active step based on route and query params
  const currentStep = React.useMemo(() => {
    if (forcedStep) return forcedStep;

    const queryStep = searchParams?.get("step");
    if (queryStep) {
      const parsed = parseInt(queryStep, 10);
      if (parsed >= 1 && parsed <= 6) return parsed;
    }

    if (
      pathname.includes("/checkout/success") ||
      pathname.includes("/checkout/receipt") ||
      searchParams?.get("confirmed") === "true"
    ) {
      return 6;
    }

    if (pathname.includes("/checkout")) {
      return 5;
    }

    if (pathname.includes("/packages")) {
      if (searchParams?.get("bundle") || searchParams?.get("customizing") === "true") {
        return 4;
      }
      return 3;
    }

    if (
      pathname.includes("/access-cards") ||
      pathname.includes("/photo-galleries") ||
      pathname === "/"
    ) {
      if (isAuthenticated || searchParams?.get("view") === "gallery") {
        return 2;
      }
      return 1;
    }

    return 2;
  }, [forcedStep, searchParams, pathname, isAuthenticated]);

  const activeDef =
    STEP_DEFINITIONS.find((s) => s.step === currentStep) || STEP_DEFINITIONS[0];

  return (
    <div className="flex flex-col items-end justify-center select-none text-right">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
        <span className="text-[#FF5A36]">STEP {activeDef.step} OF 6</span>
      </div>
      <div className="text-xs font-bold text-neutral-800 tracking-tight">
        {activeDef.label}
      </div>

      {/* 6 Step Dashes Indicator */}
      <div className="flex items-center gap-1 mt-1">
        {STEP_DEFINITIONS.map((def) => {
          const isPassed = def.step < currentStep;
          const isCurrent = def.step === currentStep;

          let colorClass = "bg-neutral-200";
          if (isPassed) {
            colorClass = "bg-emerald-500";
          } else if (isCurrent) {
            colorClass = "bg-[#FF5A36]";
          }

          return (
            <span
              key={def.step}
              className={`h-1 rounded-full transition-all duration-300 ${
                isCurrent ? "w-6" : "w-4"
              } ${colorClass}`}
              title={`Step ${def.step}: ${def.label}`}
            />
          );
        })}
      </div>
    </div>
  );
}

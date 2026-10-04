"use client";

import React from "react";
import { PaperFormatItem } from "../types/paper-formats";

export interface PackageSelectionGridProps {
  onSelectPrints: () => void;
  onSelectAllDigital: () => void;
  onConfigureBundle: () => void;
  packages?: PaperFormatItem[];
}

export function PackageSelectionGrid({
  onSelectPrints,
  onSelectAllDigital,
  onConfigureBundle,
}: PackageSelectionGridProps) {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {/* ── CARD 1: Prints Only Package ── */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            Prints Only Package
          </h3>
          <p className="text-xs text-neutral-500 font-medium leading-relaxed">
            Order physical copies of your 12 favorites
          </p>
        </div>

        <div className="my-8">
          <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            €29
          </div>
        </div>

        <button
          type="button"
          onClick={onSelectPrints}
          className="w-full py-3.5 px-4 rounded-2xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer shadow-2xs"
        >
          Select Prints
        </button>
      </div>

      {/* ── CARD 2: All Photos Digital (Featured) ── */}
      <div className="bg-[#FFF8F6] rounded-3xl border-2 border-[#FF5A36] p-7 flex flex-col justify-between shadow-md relative hover:shadow-lg transition-shadow">
        <div>
          {/* Top Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#FF5A36] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
              BEST VALUE
            </span>
            <span className="px-3 py-1 rounded-full bg-[#00C48C] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
              €20 SAVED
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            All Photos Digital
          </h3>
          <p className="text-xs text-neutral-500 font-medium leading-relaxed mt-1">
            Get all high-res digital photos of Emma & Noah
          </p>
        </div>

        <div className="my-8 flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
            €49
          </span>
          <span className="text-base text-neutral-400 line-through font-semibold">
            €69
          </span>
        </div>

        <button
          type="button"
          onClick={onSelectAllDigital}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#FF5A36] hover:bg-[#E84A26] active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#FF5A36]/25 transition-all cursor-pointer"
        >
          Select All Digital
        </button>
      </div>

      {/* ── CARD 3: Alle Pakete anschauen (Configure Bundle) ── */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            Alle Pakete anschauen
          </h3>
          <p className="text-xs text-neutral-500 font-medium leading-relaxed">
            Chose your package from the price list.
          </p>
        </div>

        <div className="my-8">
          <div className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            <span className="text-sm font-semibold text-neutral-400 block -mb-1">
              From
            </span>
            €19
          </div>
        </div>

        <button
          type="button"
          onClick={onConfigureBundle}
          className="w-full py-3.5 px-4 rounded-2xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer shadow-2xs"
        >
          Configure Bundle
        </button>
      </div>
    </div>
  );
}

"use client";

import React from "react";

export function GiftVoucherListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs flex flex-col space-y-4 animate-pulse"
        >
          {/* Certificate placeholder */}
          <div className="w-full aspect-4/3 bg-neutral-100 rounded-xl" />

          {/* Details */}
          <div className="space-y-2 flex-1">
            <div className="w-20 h-4 bg-neutral-100 rounded-md" />
            <div className="w-3/4 h-5 bg-neutral-200 rounded-md" />
            <div className="w-full h-3 bg-neutral-100 rounded-md" />
          </div>

          {/* Pricing & Button placeholder */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
            <div className="w-24 h-6 bg-neutral-200 rounded-md" />
            <div className="w-28 h-9 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

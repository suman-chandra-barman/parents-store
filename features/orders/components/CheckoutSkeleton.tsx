"use client";

import React from "react";

export function CheckoutSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-6 animate-pulse">
      {/* Top Header Breadcrumb / Title Skeleton */}
      <div className="flex items-center gap-3 border-b border-neutral-200/80 pb-4">
        <div className="h-6 w-24 bg-neutral-200 rounded-lg" />
        <span className="text-neutral-300">/</span>
        <div className="h-7 w-32 bg-neutral-200 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Cards Skeleton */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Billing Info Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="h-6 w-44 bg-neutral-200 rounded-md" />

            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-neutral-200 rounded-md" />
                  <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-neutral-200 rounded-md" />
                  <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-neutral-200 rounded-md" />
                  <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-neutral-200 rounded-md" />
                  <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-neutral-200 rounded-md" />
                  <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-neutral-200 rounded-md" />
                  <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
                </div>
              </div>

              {/* Row 4 */}
              <div className="space-y-2">
                <div className="h-4 w-12 bg-neutral-200 rounded-md" />
                <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
              </div>

              {/* Row 5 */}
              <div className="space-y-2">
                <div className="h-4 w-24 bg-neutral-200 rounded-md" />
                <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
                <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
              </div>

              {/* Row 6 */}
              <div className="space-y-2">
                <div className="h-4 w-20 bg-neutral-200 rounded-md" />
                <div className="h-10.5 w-full bg-neutral-100 rounded-xl" />
              </div>

              {/* Checkbox Skeleton */}
              <div className="pt-2 border-t border-neutral-100 flex items-center gap-2.5">
                <div className="size-4 bg-neutral-200 rounded-sm" />
                <div className="h-4 w-44 bg-neutral-200 rounded-md" />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="h-6 w-36 bg-neutral-200 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-16 bg-neutral-100 rounded-xl border border-neutral-200/60" />
              <div className="h-16 bg-neutral-100 rounded-xl border border-neutral-200/60" />
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="h-6 w-32 bg-neutral-200 rounded-md" />
            <div className="h-24 w-full bg-neutral-100 rounded-xl" />
          </div>
        </div>

        {/* Right Column: Order Summary Skeleton */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="h-6 w-32 bg-neutral-200 rounded-md" />
              <div className="h-5 w-16 bg-neutral-100 rounded-full" />
            </div>

            {/* Cart Item Skeletons */}
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 pb-3 border-b border-neutral-100 last:border-none">
                  <div className="size-16 rounded-xl bg-neutral-100 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-neutral-200 rounded-md" />
                    <div className="h-3 w-1/2 bg-neutral-100 rounded-md" />
                    <div className="h-3 w-1/3 bg-neutral-100 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Skeleton */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-100">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-neutral-100 rounded-md" />
                <div className="h-4 w-14 bg-neutral-200 rounded-md" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-neutral-100 rounded-md" />
                <div className="h-4 w-12 bg-neutral-200 rounded-md" />
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-100">
                <div className="h-5 w-14 bg-neutral-200 rounded-md" />
                <div className="h-6 w-20 bg-neutral-200 rounded-md" />
              </div>
            </div>

            {/* Submit Button Skeleton */}
            <div className="h-12 w-full bg-neutral-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

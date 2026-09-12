"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export function CartEmptyState() {
  const locale = useLocale();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center max-w-lg">
      <div className="size-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6 text-[#2060b0] shadow-xs">
        <ShoppingBag className="size-10 stroke-[1.5]" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
        Your Cart is Empty
      </h2>
      <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
        You haven&apos;t added any photo prints or packages to your cart yet.
        Explore your photos to get started!
      </p>
      <Link
        href={`/${locale}/photo-galleries/access-cards`}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#2060b0] hover:bg-[#1a4f94] shadow-xs text-sm transition-all active:scale-98"
      >
        <ArrowLeft className="size-4" />
        <span>Return to Photo Gallery</span>
      </Link>
    </div>
  );
}

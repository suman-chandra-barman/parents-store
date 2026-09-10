"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Printer, Download, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaperFormatItem } from "../types/paper-formats";
import { PaperFormatCard } from "./PaperFormatCard";
import { useCart } from "@/features/cart/hooks/useCart";

export interface PaperFormatsListProps {
  formats: PaperFormatItem[];
  photoId: string;
  photoBlobUrl?: string | null;
  isLoading?: boolean;
}

export function PaperFormatsList({
  formats,
  photoId,
  photoBlobUrl,
  isLoading = false,
}: PaperFormatsListProps) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Derive unique categories from formats
  const categories = useMemo(() => {
    const set = new Set<string>();
    formats.forEach((f) => {
      if (f.category?.title) {
        set.add(f.category.title);
      }
    });
    return Array.from(set);
  }, [formats]);

  const filteredFormats = useMemo(() => {
    if (selectedCategory === "ALL") return formats;
    if (selectedCategory === "POPULAR") {
      return formats.filter((f) => f.isMine || (f.prices && f.prices.length > 0));
    }
    if (selectedCategory === "DOWNLOAD") {
      return formats.filter((f) => f.isPhotoDownloadable);
    }
    return formats.filter((f) => f.category?.title === selectedCategory);
  }, [formats, selectedCategory]);

  const handleAddToCart = async (formatId: string, quantity: number) => {
    if (!photoId) return;
    await addToCart({
      kind: "PHOTO",
      formatId,
      quantity,
      photoIds: [photoId],
    });
  };

  return (
    <div className="w-full space-y-5">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("ALL")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5",
            selectedCategory === "ALL"
              ? "bg-[#2060b0] text-white shadow-xs"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
          )}
        >
          <Layers className="size-3.5" />
          <span>All Formats</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory("POPULAR")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5",
            selectedCategory === "POPULAR"
              ? "bg-[#2060b0] text-white shadow-xs"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
          )}
        >
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Popular</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5",
              selectedCategory === cat
                ? "bg-[#2060b0] text-white shadow-xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
            )}
          >
            <Printer className="size-3.5" />
            <span>{cat}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setSelectedCategory("DOWNLOAD")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5",
            selectedCategory === "DOWNLOAD"
              ? "bg-[#2060b0] text-white shadow-xs"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
          )}
        >
          <Download className="size-3.5" />
          <span>Downloads</span>
        </button>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full h-36 bg-neutral-100 rounded-2xl animate-pulse border border-neutral-200/60"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredFormats.length === 0 && (
        <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 space-y-2">
          <p className="text-sm font-semibold text-neutral-700">
            No formats available
          </p>
          <p className="text-xs text-neutral-500">
            There are no paper formats matching the selected filter.
          </p>
        </div>
      )}

      {/* Formats List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredFormats.map((format) => (
            <PaperFormatCard
              key={format.id}
              format={format}
              photoBlobUrl={photoBlobUrl}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

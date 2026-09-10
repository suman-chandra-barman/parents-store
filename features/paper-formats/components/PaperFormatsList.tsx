"use client";

import React from "react";
import { PaperFormatItem } from "../types/paper-formats";
import { PaperFormatCard } from "./PaperFormatCard";
import { useCart } from "@/features/cart/hooks/useCart";

export interface PaperFormatsListProps {
  formats: PaperFormatItem[];
  photoId: string;
  isLoading?: boolean;
}

export function PaperFormatsList({
  formats,
  photoId,
  isLoading = false,
}: PaperFormatsListProps) {
  const { addToCart } = useCart();

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
    <div className="w-full space-y-4">
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
      {!isLoading && formats.length === 0 && (
        <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 space-y-2">
          <p className="text-sm font-semibold text-neutral-700">
            No formats available
          </p>
          <p className="text-xs text-neutral-500">
            There are no paper formats available at this time.
          </p>
        </div>
      )}

      {/* Formats List */}
      {!isLoading && (
        <div className="space-y-4">
          {formats.map((format) => (
            <PaperFormatCard
              key={format.id}
              format={format}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

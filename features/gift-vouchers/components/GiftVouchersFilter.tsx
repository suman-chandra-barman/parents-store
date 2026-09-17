"use client";

import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GiftVouchersFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
}

export function GiftVouchersFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
}: GiftVouchersFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search vouchers by title or keywords..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-neutral-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-semibold text-neutral-500">
            {totalCount} {totalCount === 1 ? "Voucher" : "Vouchers"}
          </span>

          <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <SlidersHorizontal className="size-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs font-semibold text-neutral-700 bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="value_desc">Value: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="title_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectCategory("ALL")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
              selectedCategory === "ALL"
                ? "bg-brand text-white shadow-2xs"
                : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50"
            )}
          >
            All Vouchers
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                selectedCategory === cat
                  ? "bg-brand text-white shadow-2xs"
                  : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { PriceListFormatItem } from "../types/orders";
import { Button } from "@/components/ui/button";
import { Layers, Trash2, Check, Plus, Package } from "lucide-react";

export interface OrderItemState {
  formatId: string;
  quantity: number;
  photoIds: string[];
}

interface OrderItemsStepProps {
  items: OrderItemState[];
  formats: PriceListFormatItem[];
  isLoadingFormats: boolean;
  selectedPhotoIds: string[];
  getMaxPhotosForFormat: (format?: PriceListFormatItem) => number;
  onFormatChange: (itemIdx: number, newFormatId: string) => void;
  onQuantityChange: (itemIdx: number, qty: number) => void;
  onTogglePhotoForItem: (itemIdx: number, photoId: string) => void;
  onAddItem: () => void;
  onRemoveItem: (itemIdx: number) => void;
}

const inputClass =
  "w-full px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all";

const labelClass =
  "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1";

export function OrderItemsStep({
  items,
  formats,
  isLoadingFormats,
  selectedPhotoIds,
  getMaxPhotosForFormat,
  onFormatChange,
  onQuantityChange,
  onTogglePhotoForItem,
  onAddItem,
  onRemoveItem,
}: OrderItemsStepProps) {
  return (
    <div className="space-y-6">
      {isLoadingFormats ? (
        <div className="p-8 text-center text-xs text-muted-foreground animate-pulse space-y-2">
          <Package className="size-8 mx-auto text-brand animate-bounce" />
          <p>Loading available paper formats & packages...</p>
        </div>
      ) : formats.length === 0 ? (
        <div className="p-6 bg-muted/40 rounded-xl text-center text-xs text-muted-foreground border border-border">
          No format items found. Default format options will be assigned.
        </div>
      ) : null}

      <div className="space-y-4">
        {items.map((item, itemIdx) => {
          const selectedFormat = formats.find((f) => f.id === item.formatId);
          const maxAllowed = getMaxPhotosForFormat(selectedFormat);
          const unitPrice = selectedFormat?.prices?.[0]?.price || "9.99";

          return (
            <div
              key={itemIdx}
              className="p-4 bg-muted/30 border border-border rounded-2xl space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="size-3.5" /> Order Item #{itemIdx + 1}
                </span>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(itemIdx)}
                    className="text-xs text-destructive hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className={labelClass}>Paper Format / Package</label>
                  <select
                    value={item.formatId}
                    onChange={(e) => onFormatChange(itemIdx, e.target.value)}
                    className={inputClass}
                  >
                    {formats.map((fmt) => (
                      <option key={fmt.id} value={fmt.id}>
                        {fmt.title} ({fmt.type}) - €{fmt.prices?.[0]?.price || "9.99"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={(e) => onQuantityChange(itemIdx, parseInt(e.target.value) || 1)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-foreground">
                    Assigned Photos ({item.photoIds.length} / {maxAllowed} max)
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Format Price: <span className="font-bold text-brand">€{(Number(unitPrice) * item.quantity).toFixed(2)}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedPhotoIds.map((photoId) => {
                    const isSelected = item.photoIds.includes(photoId);
                    return (
                      <button
                        key={photoId}
                        type="button"
                        onClick={() => onTogglePhotoForItem(itemIdx, photoId)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 border ${
                          isSelected
                            ? "bg-brand text-white border-brand shadow-xs font-semibold"
                            : "bg-background text-muted-foreground border-border hover:border-brand/40"
                        }`}
                      >
                        {isSelected && <Check className="size-3" />}
                        <span>{photoId.substring(0, 8)}...</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddItem}
        className="w-full border-dashed border-border hover:border-brand text-brand rounded-xl"
      >
        <Plus className="size-4 mr-1.5" />
        Add Another Format Item
      </Button>
    </div>
  );
}

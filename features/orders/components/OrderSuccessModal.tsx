"use client";

import React from "react";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCreatedData } from "../types/orders";

interface OrderSuccessModalProps {
  open: boolean;
  orderData?: OrderCreatedData | null;
  onClose: () => void;
}

export function OrderSuccessModal({ open, orderData, onClose }: OrderSuccessModalProps) {
  if (!open || !orderData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-5 text-center relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="mx-auto size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 className="size-10 animate-in zoom-in-75 duration-300" />
        </div>

        <div>
          <span className="text-xs font-semibold text-brand uppercase tracking-wider">
            Order Submitted
          </span>
          <h2 className="text-xl font-bold text-foreground mt-1">
            Thank You for Your Order!
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Your photo print order has been placed successfully and is being processed.
          </p>
        </div>

        <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-2 text-left text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-muted-foreground">Order Reference:</span>
            <span className="font-mono font-bold text-foreground bg-background px-2 py-0.5 rounded border border-border">
              {orderData.slug || `#${orderData.id}`}
            </span>
          </div>

          {orderData.totalPrice && (
            <div className="flex justify-between items-center pt-1">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="font-bold text-brand text-sm">
                €{Number(orderData.totalPrice).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <Button
          variant="brand"
          onClick={onClose}
          className="w-full h-11 text-sm font-semibold rounded-xl"
        >
          <ShoppingBag className="size-4 mr-2" />
          Continue Browsing Photos
        </Button>
      </div>
    </div>
  );
}

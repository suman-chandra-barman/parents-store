"use client";

import React from "react";
import { OrderItemState } from "./OrderItemsStep";
import { PriceListFormatItem } from "../types/orders";
import { OrderCustomerFormData } from "../utils/order-schema";
import { Sparkles, MapPin } from "lucide-react";

interface OrderSummaryStepProps {
  items: OrderItemState[];
  formats: PriceListFormatItem[];
  customerData: OrderCustomerFormData;
}

export function OrderSummaryStep({ items, formats, customerData }: OrderSummaryStepProps) {
  return (
    <div className="space-y-5 text-xs">
      <div className="bg-brand/5 border border-brand/20 p-4 rounded-2xl space-y-3">
        <h4 className="font-bold text-brand text-sm flex items-center gap-1.5">
          <Sparkles className="size-4" /> Order Summary Review
        </h4>

        <div className="space-y-2 divide-y divide-border">
          {items.map((item, idx) => {
            const fmt = formats.find((f) => f.id === item.formatId);
            const unitPrice = fmt?.prices?.[0]?.price || "9.99";
            return (
              <div key={idx} className="pt-2 flex justify-between items-start">
                <div>
                  <div className="font-semibold text-foreground">
                    {fmt?.title || "Paper Format"} (x{item.quantity})
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    Photos: {item.photoIds.length} assigned
                  </div>
                </div>
                <div className="font-bold text-foreground">
                  €{(Number(unitPrice) * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-muted/40 border border-border p-4 rounded-2xl space-y-2">
        <h5 className="font-semibold text-foreground flex items-center gap-1">
          <MapPin className="size-3.5 text-brand" /> Billing & Shipping Address
        </h5>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">
            {customerData.firstName} {customerData.lastName}
          </strong>
          {customerData.companyName ? ` (${customerData.companyName})` : ""}
          <br />
          {customerData.addressLine1}, {customerData.note}
          <br />
          {customerData.zipCode} {customerData.city}, {customerData.state}, {customerData.country}
          <br />
          Phone: <span className="font-mono text-foreground">{customerData.phone}</span> | Email:{" "}
          <span className="font-mono text-foreground">{customerData.email || "N/A"}</span>
        </p>
      </div>

      {customerData.customerNotes && (
        <div className="bg-muted/40 border border-border p-3 rounded-xl text-muted-foreground">
          <strong className="text-foreground">Notes:</strong> {customerData.customerNotes}
        </div>
      )}
    </div>
  );
}

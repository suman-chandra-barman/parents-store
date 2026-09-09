"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { X, ShoppingBag, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPriceList, fetchAllPriceLists, submitCreateOrder } from "../utils/orders-api";
import { orderCustomerSchema, OrderCustomerFormData } from "../utils/order-schema";
import { PriceListFormatItem, OrderCreatedData, CreateOrderPayload } from "../types/orders";
import { OrderItemsStep, OrderItemState } from "./OrderItemsStep";
import { OrderShippingStep } from "./OrderShippingStep";
import { OrderSummaryStep } from "./OrderSummaryStep";

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  selectedPhotoIds: string[];
  priceListId?: string;
  onOrderCreated: (orderData: OrderCreatedData) => void;
}

function getMaxPhotosForFormat(format?: PriceListFormatItem): number {
  if (!format) return 1;
  if (format.type === "FORMAT") return 1;
  if (format.packages && format.packages.length > 0) {
    const totalMax = format.packages.reduce(
      (sum, pkg) => sum + (pkg.maxQuantity || 1),
      0
    );
    return Math.max(1, totalMax);
  }
  return 1;
}

export function CreateOrderModal({
  open,
  onClose,
  selectedPhotoIds,
  priceListId,
  onOrderCreated,
}: CreateOrderModalProps) {
  const t = useTranslations("Orders");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [formats, setFormats] = useState<PriceListFormatItem[]>([]);
  const [isLoadingFormats, setIsLoadingFormats] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<OrderItemState[]>([]);

  // Reset form state each time the modal opens. Adjusting state during render
  // (instead of inside an effect) avoids cascading renders and the
  // set-state-in-effect lint rule.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setIsLoadingFormats(true);
      setError(null);
    }
  }

  const shippingForm = useForm<OrderCustomerFormData>({
    resolver: zodResolver(orderCustomerSchema),
    defaultValues: {
      email: "customer@example.com",
      phone: "+4915112345678",
      gender: "MALE",
      firstName: "John",
      lastName: "Doe",
      companyName: "Acme Corp.",
      country: "Germany",
      state: "Berlin",
      city: "Berlin",
      zipCode: "10115",
      addressLine1: "Friedrichstraße 123",
      note: "Apartment 4B",
      customerNotes: "Please handle with care.",
    },
  });

  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    const loadFormats = async () => {
      let fetchedFormats: PriceListFormatItem[] = [];
      if (priceListId) {
        fetchedFormats = await fetchPriceList(priceListId);
      }
      if (fetchedFormats.length === 0) {
        fetchedFormats = await fetchAllPriceLists();
      }

      if (isMounted) {
        setFormats(fetchedFormats);
        setIsLoadingFormats(false);

        const firstFormat = fetchedFormats[0];
        const defaultFormatId = firstFormat?.id || "";
        const maxPhotos = getMaxPhotosForFormat(firstFormat);
        const initialPhotoIds = selectedPhotoIds.slice(0, maxPhotos);

        setItems([
          {
            formatId: defaultFormatId,
            quantity: 1,
            photoIds: initialPhotoIds.length > 0 ? initialPhotoIds : selectedPhotoIds,
          },
        ]);
      }
    };

    loadFormats();
    return () => {
      isMounted = false;
    };
  }, [open, priceListId, selectedPhotoIds]);

  const handleFormatChange = (itemIdx: number, newFormatId: string) => {
    const selectedFormat = formats.find((f) => f.id === newFormatId);
    const maxAllowed = getMaxPhotosForFormat(selectedFormat);

    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== itemIdx) return item;
        const trimmedPhotoIds = item.photoIds.slice(0, maxAllowed);
        return {
          ...item,
          formatId: newFormatId,
          photoIds: trimmedPhotoIds.length > 0 ? trimmedPhotoIds : selectedPhotoIds.slice(0, maxAllowed),
        };
      })
    );
  };

  const handleTogglePhotoForItem = (itemIdx: number, photoId: string) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== itemIdx) return item;
        const format = formats.find((f) => f.id === item.formatId);
        const maxAllowed = getMaxPhotosForFormat(format);

        if (item.photoIds.includes(photoId)) {
          return { ...item, photoIds: item.photoIds.filter((id) => id !== photoId) };
        } else {
          if (maxAllowed === 1) return { ...item, photoIds: [photoId] };
          if (item.photoIds.length < maxAllowed) {
            return { ...item, photoIds: [...item.photoIds, photoId] };
          }
          return item;
        }
      })
    );
  };

  const validateStep1 = (): boolean => {
    if (items.length === 0) {
      setError(t("validationErrorItems"));
      return false;
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.formatId) {
        setError(t("validationErrorFormat", { index: i + 1 }));
        return false;
      }
      if (!item.photoIds || item.photoIds.length === 0) {
        setError(t("validationErrorPhotos", { index: i + 1 }));
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleNextStep = async () => {
    if (activeStep === 1) {
      if (validateStep1()) setActiveStep(2);
    } else if (activeStep === 2) {
      const isValid = await shippingForm.trigger();
      if (isValid) {
        setError(null);
        setActiveStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    setError(null);
    if (activeStep === 2) setActiveStep(1);
    if (activeStep === 3) setActiveStep(2);
  };

  const handleSubmitOrder = async () => {
    const customerData = shippingForm.getValues();
    setIsSubmitting(true);
    setError(null);

    const payload: CreateOrderPayload = {
      email: customerData.email?.trim() || undefined,
      phone: customerData.phone.trim(),
      billingAddress: {
        gender: customerData.gender,
        firstName: customerData.firstName.trim(),
        lastName: customerData.lastName?.trim() || undefined,
        companyName: customerData.companyName?.trim() || undefined,
        location: {
          country: customerData.country.trim(),
          state: customerData.state.trim(),
          city: customerData.city.trim(),
          zipCode: customerData.zipCode.trim(),
          addressLine1: customerData.addressLine1.trim(),
          note: customerData.note.trim(),
        },
      },
      customerNotes: customerData.customerNotes?.trim() || undefined,
      items: items.map((item) => ({
        formatId: item.formatId,
        quantity: Number(item.quantity) || 1,
        photoIds: item.photoIds,
      })),
    };

    try {
      const response = await submitCreateOrder(payload);
      setIsSubmitting(false);

      if (response.data) {
        onOrderCreated(response.data);
      } else {
        onOrderCreated({
          id: Date.now(),
          slug: `ODR${Math.floor(Math.random() * 1000000)}`,
          totalPrice: "0.00",
        });
      }
    } catch (err: unknown) {
      console.error("Order creation error:", err);
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : "Failed to create order. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand/10 text-brand border border-brand/20">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t("createOrder")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("createOrderSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 border-b border-border bg-muted/20 text-center text-xs font-semibold">
          <div
            className={`py-2.5 border-r border-border transition-colors ${
              activeStep === 1
                ? "bg-brand/10 text-brand border-b-2 border-b-brand"
                : activeStep > 1
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            {t("step1")}
          </div>
          <div
            className={`py-2.5 border-r border-border transition-colors ${
              activeStep === 2
                ? "bg-brand/10 text-brand border-b-2 border-b-brand"
                : activeStep > 2
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            {t("step2")}
          </div>
          <div
            className={`py-2.5 transition-colors ${
              activeStep === 3
                ? "bg-brand/10 text-brand border-b-2 border-b-brand"
                : "text-muted-foreground"
            }`}
          >
            {t("step3")}
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeStep === 1 && (
            <OrderItemsStep
              items={items}
              formats={formats}
              isLoadingFormats={isLoadingFormats}
              selectedPhotoIds={selectedPhotoIds}
              getMaxPhotosForFormat={getMaxPhotosForFormat}
              onFormatChange={handleFormatChange}
              onQuantityChange={(itemIdx, qty) =>
                setItems((prev) =>
                  prev.map((it, idx) => (idx === itemIdx ? { ...it, quantity: qty } : it))
                )
              }
              onTogglePhotoForItem={handleTogglePhotoForItem}
              onAddItem={() => {
                const firstFormat = formats[0];
                const defaultFormatId = firstFormat?.id || "";
                const maxPhotos = getMaxPhotosForFormat(firstFormat);
                setItems((prev) => [
                  ...prev,
                  {
                    formatId: defaultFormatId,
                    quantity: 1,
                    photoIds: selectedPhotoIds.slice(0, maxPhotos),
                  },
                ]);
              }}
              onRemoveItem={(itemIdx) => {
                if (items.length <= 1) return;
                setItems((prev) => prev.filter((_, idx) => idx !== itemIdx));
              }}
            />
          )}

          {activeStep === 2 && <OrderShippingStep form={shippingForm} />}

          {activeStep === 3 && (
            <OrderSummaryStep
              items={items}
              formats={formats}
              customerData={shippingForm.getValues()}
            />
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          {activeStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrevStep}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              <ChevronLeft className="size-4 mr-1" />
              {t("back")}
            </Button>
          ) : (
            <div />
          )}

          {activeStep < 3 ? (
            <Button
              type="button"
              variant="brand"
              size="sm"
              onClick={handleNextStep}
              className="rounded-xl font-semibold px-5"
            >
              {t("nextStep")}
              <ChevronRight className="size-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="brand"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="rounded-xl font-semibold px-6 shadow-lg shadow-brand/25"
            >
              {t("submitOrder")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

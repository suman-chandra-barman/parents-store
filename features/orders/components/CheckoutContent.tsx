"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/features/cart/hooks/useCart";
import { useCreateOrderFromCartMutation } from "../api/ordersApi";
import {
  CheckoutFormData,
  CheckoutFormSchema,
} from "../schemas/checkout-schemas";
import {
  OrderCreatedData,
  CreateOrderFromCartPayload,
} from "../types/orders";
import { BillingInfoForm } from "./BillingInfoForm";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { CheckoutSummaryCard } from "./CheckoutSummaryCard";
import { OrderSuccessView } from "./OrderSuccessView";
import { parseErrorMessage } from "@/utils/parseErrorMessage";

export function CheckoutContent() {
  const locale = useLocale();
  const { cart, sessionId, isLoading: isCartLoading, refreshCart } = useCart();
  const [createOrderFromCart, { isLoading: isSubmitting }] =
    useCreateOrderFromCartMutation();
  const [createdOrder, setCreatedOrder] = useState<OrderCreatedData | null>(
    null
  );

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      email: cart?.email || "",
      phone: "",
      billingAddress: {
        firstName: "",
        lastName: "",
        companyName: "",
        country: "US",
        state: "",
        city: "",
        zipCode: "",
        addressLine1: "",
        note: "",
      },
      shipToDifferentAddress: false,
      deliveryAddress: {
        firstName: "",
        lastName: "",
        companyName: "",
        country: "US",
        state: "",
        city: "",
        zipCode: "",
        addressLine1: "",
        note: "",
      },
      customerNotes: "",
      paymentMethod: "CREDIT_CARD",
    },
  });

  const onInvalid = (errors: FieldErrors<CheckoutFormData>) => {
    console.error("Checkout form validation errors:", errors);
    const firstError =
      errors.billingAddress?.firstName?.message ||
      errors.billingAddress?.addressLine1?.message ||
      errors.billingAddress?.city?.message ||
      errors.billingAddress?.state?.message ||
      errors.billingAddress?.zipCode?.message ||
      errors.billingAddress?.country?.message ||
      errors.email?.message ||
      errors.phone?.message ||
      errors.deliveryAddress?.firstName?.message ||
      errors.deliveryAddress?.addressLine1?.message ||
      errors.deliveryAddress?.city?.message ||
      "Please fill in all required billing information marked with *";
    toast.error(firstError as string);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!sessionId) {
      toast.error("Session ID is missing. Please refresh your page.");
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const cleanEmail = data.email?.trim();
      const cleanPhone = data.phone?.trim();
      const cleanNotes = data.customerNotes?.trim();

      const payload: CreateOrderFromCartPayload = {
        sessionId,
        ...(cleanEmail ? { email: cleanEmail } : {}),
        ...(cleanPhone ? { phone: cleanPhone } : {}),
        billingAddress: {
          ...(data.billingAddress.gender && data.billingAddress.gender !== "NOT_SPECIFIED"
            ? { gender: data.billingAddress.gender }
            : {}),
          firstName: data.billingAddress.firstName.trim(),
          ...(data.billingAddress.lastName?.trim()
            ? { lastName: data.billingAddress.lastName.trim() }
            : {}),
          ...(data.billingAddress.companyName?.trim()
            ? { companyName: data.billingAddress.companyName.trim() }
            : {}),
          location: {
            country: data.billingAddress.country.trim(),
            state: data.billingAddress.state.trim(),
            city: data.billingAddress.city.trim(),
            zipCode: data.billingAddress.zipCode.trim(),
            addressLine1: data.billingAddress.addressLine1.trim(),
            note: data.billingAddress.note?.trim() || "N/A",
          },
        },
        ...(data.shipToDifferentAddress && data.deliveryAddress?.firstName?.trim()
          ? {
              deliveryAddress: {
                ...(data.deliveryAddress.gender && data.deliveryAddress.gender !== "NOT_SPECIFIED"
                  ? { gender: data.deliveryAddress.gender }
                  : {}),
                firstName: data.deliveryAddress.firstName.trim(),
                ...(data.deliveryAddress.lastName?.trim()
                  ? { lastName: data.deliveryAddress.lastName.trim() }
                  : {}),
                ...(data.deliveryAddress.companyName?.trim()
                  ? { companyName: data.deliveryAddress.companyName.trim() }
                  : {}),
                location: {
                  country: data.deliveryAddress.country?.trim() || "US",
                  state: data.deliveryAddress.state?.trim() || "",
                  city: data.deliveryAddress.city?.trim() || "",
                  zipCode: data.deliveryAddress.zipCode?.trim() || "",
                  addressLine1:
                    data.deliveryAddress.addressLine1?.trim() || "",
                  note: data.deliveryAddress.note?.trim() || "N/A",
                },
              },
            }
          : {}),
        ...(cleanNotes ? { customerNotes: cleanNotes } : {}),
      };

      const response = await createOrderFromCart(payload).unwrap();

      if (response?.data) {
        setCreatedOrder(response.data);
        await refreshCart();
        toast.success("Order created successfully! 🎉");
      }
    } catch (err: unknown) {
      const msg = parseErrorMessage(err, "Failed to create order.");
      toast.error(msg);
    }
  };

  if (createdOrder) {
    return <OrderSuccessView orderData={createdOrder} />;
  }

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="size-8 animate-spin text-brand mb-3" />
        <p className="text-sm font-medium">Preparing checkout...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center max-w-md">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-neutral-500 mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href={`/${locale}/cart`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-brand hover:opacity-90 text-xs transition-all shadow-sm"
        >
          <ArrowLeft className="size-4" />
          <span>View Cart</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-neutral-200/80 pb-4">
        <Link
          href={`/${locale}/cart`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Cart</span>
        </Link>
        <span className="text-neutral-300">/</span>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Checkout
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Billing Information & Payment Method */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <BillingInfoForm form={form} />
            <PaymentMethodSelector form={form} />
          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            <CheckoutSummaryCard isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/features/cart/hooks/useCart";
import {
  useCreateOrderFromCartMutation,
  useCreateInvoiceMutation,
} from "../api/ordersApi";
import {
  CheckoutFormData,
  CheckoutFormSchema,
} from "../schemas/checkout-schemas";
import { CreateOrderFromCartPayload } from "../types/orders";
import { BillingInfoForm } from "./BillingInfoForm";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { CheckoutSummaryCard } from "./CheckoutSummaryCard";
import { CheckoutSkeleton } from "./CheckoutSkeleton";
import { parseErrorMessage } from "@/utils/parseErrorMessage";

export function CheckoutContent() {
  const locale = useLocale();
  const router = useRouter();
  const { cart, sessionId, isLoading: isCartLoading, refreshCart } = useCart();
  const [createOrderFromCart, { isLoading: isSubmittingOrder }] =
    useCreateOrderFromCartMutation();
  const [createInvoice, { isLoading: isCreatingInvoice }] =
    useCreateInvoiceMutation();

  const isSubmitting = isSubmittingOrder || isCreatingInvoice;

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
          ...(data.billingAddress.gender &&
          data.billingAddress.gender !== "NOT_SPECIFIED"
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
        ...(data.shipToDifferentAddress &&
        data.deliveryAddress?.firstName?.trim()
          ? {
              deliveryAddress: {
                ...(data.deliveryAddress.gender &&
                data.deliveryAddress.gender !== "NOT_SPECIFIED"
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
                  addressLine1: data.deliveryAddress.addressLine1?.trim() || "",
                  note: data.deliveryAddress.note?.trim() || "N/A",
                },
              },
            }
          : {}),
        ...(cleanNotes ? { customerNotes: cleanNotes } : {}),
      };

      const response = await createOrderFromCart(payload).unwrap();

      if (response?.data) {
        const orderSlug = response.data.slug;
        await refreshCart();
        toast.success("Order created successfully! 🎉");

        if (orderSlug) {
          try {
            const invoice = await createInvoice({
              orderSlug,
              paymentMethod: "INVOICE",
            }).unwrap();

            if (invoice?.media?.url) {
              window.open(invoice.media.url, "_blank");
            }
          } catch (invoiceErr) {
            console.error("Auto-create/open invoice error:", invoiceErr);
          }
        }

        router.push(`/${locale}/photo-galleries/access-cards`);
      }
    } catch (err: unknown) {
      const msg = parseErrorMessage(err, "Failed to create order.");
      toast.error(msg);
    }
  };

  if (isCartLoading) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-6">
      {/* Top Header */}
      <div className="border-b border-neutral-200/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Checkout
        </h1>
        <Link
          href={`/${locale}/cart`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Cart</span>
        </Link>
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

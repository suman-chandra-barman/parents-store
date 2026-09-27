"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CheckoutFormData } from "../schemas/checkout-schemas";
import { AddressFields } from "./AddressFields";
import { useAddressCountrySync } from "../hooks/useAddressCountrySync";
import { cn } from "@/lib/utils";

interface BillingInfoFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

export function BillingInfoForm({ form }: BillingInfoFormProps) {
  const t = useTranslations("Checkout");

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const shipToDifferentAddress = watch("shipToDifferentAddress");
  const billingCountry = watch("billingAddress.country");
  const deliveryCountry = watch("deliveryAddress.country");

  useAddressCountrySync(billingCountry, "billingAddress.state", setValue);
  useAddressCountrySync(deliveryCountry, "deliveryAddress.state", setValue);

  return (
    <div className="space-y-8">
      {/* Billing Information Section */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
          {t("billingInformation")}
        </h2>

        <AddressFields
          prefix="billingAddress"
          form={form}
          slotAfterName={
            /* Contact Row: Email & Phone */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  {t("email")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  {...register("email")}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all",
                    errors.email
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  {t("phone")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  {...register("phone")}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all",
                    errors.phone
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          }
        />

        {/* Ship to a different address toggle */}
        <div className="pt-2 border-t border-neutral-100">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("shipToDifferentAddress")}
              className="size-4 rounded-sm border-neutral-300 text-brand focus:ring-brand"
            />
            <span className="text-xs font-semibold text-neutral-700">
              {t("shipToDifferentAddress")}
            </span>
          </label>
        </div>
      </div>

      {/* Optional Delivery Address if toggled */}
      {shipToDifferentAddress && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            {t("deliveryAddress")}
          </h2>

          <AddressFields prefix="deliveryAddress" form={form} />
        </div>
      )}

      {/* Additional Info Section */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
          {t("additionalInfo")}
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            {t("orderNotes")}
          </label>
          <textarea
            rows={4}
            placeholder={t("orderNotesPlaceholder")}
            {...register("customerNotes")}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}

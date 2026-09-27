"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { CheckoutFormData } from "../schemas/checkout-schemas";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { StateSelect } from "@/components/ui/StateSelect";
import { cn } from "@/lib/utils";

interface AddressFieldsProps {
  prefix: "billingAddress" | "deliveryAddress";
  form: UseFormReturn<CheckoutFormData>;
  slotAfterName?: React.ReactNode;
}

export function AddressFields({
  prefix,
  form,
  slotAfterName,
}: AddressFieldsProps) {
  const t = useTranslations("Checkout");
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const currentCountry = watch(`${prefix}.country`);
  const fieldErrors = errors[prefix];

  return (
    <div className="space-y-4">
      {/* Row 1: First name & Last name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            {t("firstName")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={
              prefix === "billingAddress"
                ? t("firstNamePlaceholder")
                : t("deliveryFirstNamePlaceholder")
            }
            {...register(`${prefix}.firstName`)}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all",
              fieldErrors?.firstName
                ? "border-red-400 ring-1 ring-red-200"
                : "border-neutral-200 hover:border-neutral-300"
            )}
          />
          {fieldErrors?.firstName && (
            <p className="text-[11px] text-red-500 font-medium">
              {fieldErrors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            {t("lastName")}
          </label>
          <input
            type="text"
            placeholder={
              prefix === "billingAddress"
                ? t("lastNamePlaceholder")
                : t("deliveryLastNamePlaceholder")
            }
            {...register(`${prefix}.lastName`)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Optional slot (e.g. Email & Phone for billing) */}
      {slotAfterName}

      {/* Row: Country / Region & State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            {t("countryRegion")} <span className="text-red-500">*</span>
          </label>
          <CountrySelect
            placeholder={t("selectCountry")}
            {...register(`${prefix}.country`)}
            hasError={Boolean(fieldErrors?.country)}
          />
          {fieldErrors?.country && (
            <p className="text-[11px] text-red-500 font-medium">
              {fieldErrors.country.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            {t("states")} <span className="text-red-500">*</span>
          </label>
          <StateSelect
            countryCode={currentCountry}
            placeholder={t("selectState")}
            {...register(`${prefix}.state`)}
            hasError={Boolean(fieldErrors?.state)}
          />
          {fieldErrors?.state && (
            <p className="text-[11px] text-red-500 font-medium">
              {fieldErrors.state.message}
            </p>
          )}
        </div>
      </div>

      {/* Row: ZIP */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-700">
          {t("zip")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={
            prefix === "billingAddress"
              ? t("zipPlaceholder")
              : t("deliveryZipPlaceholder")
          }
          {...register(`${prefix}.zipCode`)}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all",
            fieldErrors?.zipCode
              ? "border-red-400 ring-1 ring-red-200"
              : "border-neutral-200 hover:border-neutral-300"
          )}
        />
        {fieldErrors?.zipCode && (
          <p className="text-[11px] text-red-500 font-medium">
            {fieldErrors.zipCode.message}
          </p>
        )}
      </div>

      {/* Row: Street Address */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-700">
          {t("streetAddress")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={t("streetAddressPlaceholder")}
          {...register(`${prefix}.addressLine1`)}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all",
            fieldErrors?.addressLine1
              ? "border-red-400 ring-1 ring-red-200"
              : "border-neutral-200 hover:border-neutral-300"
          )}
        />
        {fieldErrors?.addressLine1 && (
          <p className="text-[11px] text-red-500 font-medium">
            {fieldErrors.addressLine1.message}
          </p>
        )}

        <input
          type="text"
          placeholder={t("streetAddressNotePlaceholder")}
          {...register(`${prefix}.note`)}
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all"
        />
      </div>

      {/* Row: Town City */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-700">
          {t("townCity")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={t("townCityPlaceholder")}
          {...register(`${prefix}.city`)}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all",
            fieldErrors?.city
              ? "border-red-400 ring-1 ring-red-200"
              : "border-neutral-200 hover:border-neutral-300"
          )}
        />
        {fieldErrors?.city && (
          <p className="text-[11px] text-red-500 font-medium">
            {fieldErrors.city.message}
          </p>
        )}
      </div>
    </div>
  );
}

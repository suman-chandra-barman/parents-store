"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { OrderCustomerFormData } from "../utils/order-schema";
import { User, Phone, Mail, MapPin, FileText } from "lucide-react";

interface OrderShippingStepProps {
  form: UseFormReturn<OrderCustomerFormData>;
}

const inputClass =
  "w-full px-3.5 py-2.5 bg-muted/40 border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all";

const labelClass =
  "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1";

export function OrderShippingStep({ form }: OrderShippingStepProps) {
  const t = useTranslations("Orders");
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-5">
      <div className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
        <User className="size-4" /> {t("customerContactInfo")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className={labelClass}>
            {t("phoneNumber")} <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Phone className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="tel"
              {...register("phone")}
              placeholder="+4915112345678"
              className={`${inputClass} pl-8`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive mt-0.5">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className={labelClass}>{t("emailAddress")}</label>
          <div className="relative">
            <Mail className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="email"
              {...register("email")}
              placeholder="customer@example.com"
              className={`${inputClass} pl-8`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-0.5">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1.5 pt-2">
        <MapPin className="size-4" /> {t("billingAddressDetails")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className={labelClass}>{t("gender")}</label>
          <select {...register("gender")} className={inputClass}>
            <option value="MALE">{t("male")}</option>
            <option value="FEMALE">{t("female")}</option>
            <option value="NOT_SPECIFIED">{t("notSpecified")}</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>
            {t("firstName")} <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            {...register("firstName")}
            placeholder="John"
            className={inputClass}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive mt-0.5">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className={labelClass}>{t("lastName")}</label>
          <input
            type="text"
            {...register("lastName")}
            placeholder="Doe"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>{t("companyName")}</label>
        <input
          type="text"
          {...register("companyName")}
          placeholder="Acme Corp."
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className={labelClass}>
            {t("streetAddress")} <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            {...register("addressLine1")}
            placeholder="Friedrichstraße 123"
            className={inputClass}
          />
          {errors.addressLine1 && (
            <p className="text-xs text-destructive mt-0.5">{errors.addressLine1.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className={labelClass}>
            {t("apartmentNote")} <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            {...register("note")}
            placeholder="Apartment 4B"
            className={inputClass}
          />
          {errors.note && (
            <p className="text-xs text-destructive mt-0.5">{errors.note.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className={labelClass}>{t("city")} *</label>
          <input type="text" {...register("city")} className={inputClass} />
          {errors.city && (
            <p className="text-xs text-destructive mt-0.5">{errors.city.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className={labelClass}>{t("state")} *</label>
          <input type="text" {...register("state")} className={inputClass} />
          {errors.state && (
            <p className="text-xs text-destructive mt-0.5">{errors.state.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className={labelClass}>{t("zipCode")} *</label>
          <input type="text" {...register("zipCode")} className={inputClass} />
          {errors.zipCode && (
            <p className="text-xs text-destructive mt-0.5">{errors.zipCode.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className={labelClass}>{t("country")} *</label>
          <input type="text" {...register("country")} className={inputClass} />
          {errors.country && (
            <p className="text-xs text-destructive mt-0.5">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1 pt-2">
        <label className={labelClass}>
          <FileText className="size-3 inline mr-1" /> {t("specialNotes")}
        </label>
        <textarea
          rows={2}
          {...register("customerNotes")}
          placeholder={t("specialNotesPlaceholder")}
          className={inputClass}
        />
      </div>
    </div>
  );
}

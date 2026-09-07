"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
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
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-5">
      <div className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
        <User className="size-4" /> Customer Contact Information
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className={labelClass}>
            Phone Number <span className="text-destructive">*</span>
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
          <label className={labelClass}>Email Address</label>
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
        <MapPin className="size-4" /> Billing Address Details
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className={labelClass}>Gender</label>
          <select {...register("gender")} className={inputClass}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NOT_SPECIFIED">Not Specified</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>
            First Name <span className="text-destructive">*</span>
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
          <label className={labelClass}>Last Name</label>
          <input
            type="text"
            {...register("lastName")}
            placeholder="Doe"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Company Name (Optional)</label>
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
            Street Address (Line 1) <span className="text-destructive">*</span>
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
            Apartment / Note <span className="text-destructive">*</span>
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
          <label className={labelClass}>City *</label>
          <input type="text" {...register("city")} className={inputClass} />
          {errors.city && (
            <p className="text-xs text-destructive mt-0.5">{errors.city.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className={labelClass}>State *</label>
          <input type="text" {...register("state")} className={inputClass} />
          {errors.state && (
            <p className="text-xs text-destructive mt-0.5">{errors.state.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Zip Code *</label>
          <input type="text" {...register("zipCode")} className={inputClass} />
          {errors.zipCode && (
            <p className="text-xs text-destructive mt-0.5">{errors.zipCode.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Country *</label>
          <input type="text" {...register("country")} className={inputClass} />
          {errors.country && (
            <p className="text-xs text-destructive mt-0.5">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1 pt-2">
        <label className={labelClass}>
          <FileText className="size-3 inline mr-1" /> Special Instructions / Notes
        </label>
        <textarea
          rows={2}
          {...register("customerNotes")}
          placeholder="Please handle with care..."
          className={inputClass}
        />
      </div>
    </div>
  );
}

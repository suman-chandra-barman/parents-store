"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CheckoutFormData } from "../schemas/checkout-schemas";
import { cn } from "@/lib/utils";

interface BillingInfoFormProps {
  form: UseFormReturn<CheckoutFormData>;
}

export function BillingInfoForm({ form }: BillingInfoFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const shipToDifferentAddress = watch("shipToDifferentAddress");

  return (
    <div className="space-y-8">
      {/* Billing Information Section */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
          Billing Information
        </h2>

        <div className="space-y-4">
          {/* Row 1: First name & Last name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                First name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your first name"
                {...register("billingAddress.firstName")}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all",
                  errors.billingAddress?.firstName
                    ? "border-red-400 ring-1 ring-red-200"
                    : "border-neutral-200 hover:border-neutral-300"
                )}
              />
              {errors.billingAddress?.firstName && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.billingAddress.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Last name
              </label>
              <input
                type="text"
                placeholder="Your last name"
                {...register("billingAddress.lastName")}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Email Address"
                {...register("email")}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all",
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
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Phone number"
                {...register("phone")}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all",
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

          {/* Row 3: Country / Region & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Country / Region <span className="text-red-500">*</span>
              </label>
              <select
                {...register("billingAddress.country")}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all"
              >
                <option value="US">United States (US)</option>
                <option value="DE">Germany (DE)</option>
                <option value="AT">Austria (AT)</option>
                <option value="CH">Switzerland (CH)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
                <option value="FR">France (FR)</option>
                <option value="IT">Italy (IT)</option>
                <option value="ES">Spain (ES)</option>
                <option value="NL">Netherlands (NL)</option>
                <option value="BE">Belgium (BE)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                States <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="State / Province"
                {...register("billingAddress.state")}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all",
                  errors.billingAddress?.state
                    ? "border-red-400 ring-1 ring-red-200"
                    : "border-neutral-200 hover:border-neutral-300"
                )}
              />
              {errors.billingAddress?.state && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.billingAddress.state.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: ZIP */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              ZIP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="ZIP / Postal code"
              {...register("billingAddress.zipCode")}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all",
                errors.billingAddress?.zipCode
                  ? "border-red-400 ring-1 ring-red-200"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            />
            {errors.billingAddress?.zipCode && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.billingAddress.zipCode.message}
              </p>
            )}
          </div>

          {/* Row 5: Street Address */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-700">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="House number & Street name"
              {...register("billingAddress.addressLine1")}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all",
                errors.billingAddress?.addressLine1
                  ? "border-red-400 ring-1 ring-red-200"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            />
            {errors.billingAddress?.addressLine1 && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.billingAddress.addressLine1.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Apartment, suite, unit, etc. (Optional)"
              {...register("billingAddress.note")}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all"
            />
          </div>

          {/* Row 6: Town City */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              Town City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Town / City"
              {...register("billingAddress.city")}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all",
                errors.billingAddress?.city
                  ? "border-red-400 ring-1 ring-red-200"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            />
            {errors.billingAddress?.city && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.billingAddress.city.message}
              </p>
            )}
          </div>

          {/* Ship to a different address toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("shipToDifferentAddress")}
                className="size-4 rounded-sm border-neutral-300 text-[#2060b0] focus:ring-[#2060b0]"
              />
              <span className="text-xs font-semibold text-neutral-700">
                Ship to a different address
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Optional Delivery Address if toggled */}
      {shipToDifferentAddress && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Delivery Address
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  {...register("deliveryAddress.firstName")}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  {...register("deliveryAddress.lastName")}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("deliveryAddress.country")}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white"
                >
                  <option value="US">United States (US)</option>
                  <option value="DE">Germany (DE)</option>
                  <option value="AT">Austria (AT)</option>
                  <option value="CH">Switzerland (CH)</option>
                  <option value="GB">United Kingdom (GB)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  States <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="State"
                  {...register("deliveryAddress.state")}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                ZIP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="ZIP"
                {...register("deliveryAddress.zipCode")}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="House number & Street name"
                {...register("deliveryAddress.addressLine1")}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white"
              />
              <input
                type="text"
                placeholder="Apartment, suite, unit, etc. (Optional)"
                {...register("deliveryAddress.note")}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Town City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Town / City"
                {...register("deliveryAddress.city")}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Additional Info Section */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
          Additional Info
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            Order Notes (Optional)
          </label>
          <textarea
            rows={4}
            placeholder="Notes about your order, e.g. special notes for delivery"
            {...register("customerNotes")}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0] focus:bg-white transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}

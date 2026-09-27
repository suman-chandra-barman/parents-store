"use client";

import { useEffect, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { CheckoutFormData } from "../schemas/checkout-schemas";

type AddressStateField = "billingAddress.state" | "deliveryAddress.state";

export function useAddressCountrySync(
  country: string | undefined,
  fieldToReset: AddressStateField,
  setValue: UseFormSetValue<CheckoutFormData>
) {
  const prevCountryRef = useRef(country);

  useEffect(() => {
    if (prevCountryRef.current && prevCountryRef.current !== country) {
      setValue(fieldToReset, "");
    }
    prevCountryRef.current = country;
  }, [country, fieldToReset, setValue]);
}

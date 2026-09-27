"use client";

import * as React from "react";
import { Country } from "country-state-city";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CountrySelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  placeholder?: string;
}

export const CountrySelect = React.forwardRef<
  HTMLSelectElement,
  CountrySelectProps
>(({ className, hasError = false, placeholder, ...props }, ref) => {
  const countries = React.useMemo(() => {
    return Country.getAllCountries().sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, []);

  return (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all cursor-pointer",
          hasError
            ? "border-red-400 ring-1 ring-red-200"
            : "border-neutral-200 hover:border-neutral-300",
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {countries.map((country) => (
          <option key={country.isoCode} value={country.isoCode}>
            {country.name}
          </option>
        ))}
      </select>
      <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
    </div>
  );
});

CountrySelect.displayName = "CountrySelect";

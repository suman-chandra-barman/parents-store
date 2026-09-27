"use client";

import * as React from "react";
import { State } from "country-state-city";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StateSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  countryCode?: string;
  hasError?: boolean;
  placeholder?: string;
}

export const StateSelect = React.forwardRef<
  HTMLSelectElement,
  StateSelectProps
>(
  (
    {
      className,
      countryCode,
      hasError = false,
      placeholder = "Select State / Province",
      ...props
    },
    ref
  ) => {
    const states = React.useMemo(() => {
      if (!countryCode) return [];
      return State.getStatesOfCountry(countryCode).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }, [countryCode]);

    if (states.length === 0) {
      return (
        <div className="relative w-full">
          <input
            ref={ref as unknown as React.Ref<HTMLInputElement>}
            type="text"
            placeholder={placeholder === "Select State / Province" ? "State / Province" : placeholder}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all",
              hasError
                ? "border-red-400 ring-1 ring-red-200"
                : "border-neutral-200 hover:border-neutral-300",
              className
            )}
            {...(props as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        </div>
      );
    }

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
          <option value="">{placeholder}</option>
          {states.map((state) => (
            <option key={state.isoCode || state.name} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
        <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
      </div>
    );
  }
);

StateSelect.displayName = "StateSelect";

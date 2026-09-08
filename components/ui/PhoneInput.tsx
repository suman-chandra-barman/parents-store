/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { ChevronsUpDown, Globe } from 'lucide-react';

export type PhoneInputValue = RPNInput.Value;

interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  value?: PhoneInputValue;
  onChange?: (value: PhoneInputValue) => void;
  defaultCountry?: RPNInput.Country;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, defaultCountry = 'US', ...props }, ref) => {
    return (
      <RPNInput.default
        ref={ref as any}
        className="flex items-center gap-2"
        aria-label="Phone number input"
        placeholder="Enter phone number"
        value={value}
        onChange={(val) => onChange?.(val || ('' as PhoneInputValue))}
        defaultCountry={defaultCountry}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        {...props}
      />
    );
  },
);
PhoneInput.displayName = 'PhoneInput';

/* Custom Sub-components */

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900"
    {...props}
  />
));
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as RPNInput.Country);
  };

  return (
    <div className="relative flex items-center">
      <div className="pointer-events-none absolute left-3 flex items-center gap-2 z-10">
        <FlagComponent country={value} countryName={value} />
      </div>

      {/* Native Select with custom trigger look for zero JS popover weight */}
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className="h-10 w-18 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 pl-3 pr-6 text-xs font-semibold text-transparent transition-all focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-slate-800 dark:bg-slate-900"
      >
        {options.map((option) => (
          <option
            key={option.value || 'ZZ'}
            value={option.value}
            className="text-slate-900 dark:text-slate-100 dark:bg-slate-900"
          >
            {option.label}{' '}
            {option.value && `+${RPNInput.getCountryCallingCode(option.value)}`}
          </option>
        ))}
      </select>
      <ChevronsUpDown className="pointer-events-none absolute right-2 size-3 text-slate-400" />
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-slate-100">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <Globe className="size-4 text-slate-400" />
      )}
    </span>
  );
};

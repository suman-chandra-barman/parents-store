/* eslint-disable react-hooks/incompatible-library */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2, User, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type {
  PreRegistrationForm,
  PreRegistrationSuccessData,
  PreRegistrationValidationIssue,
  PreRegistrationFormError,
} from '../types/pre-registration';
import { useSubmitPreRegistrationMutation } from '../api/preRegistrationApi';
import { parseErrorMessage } from '@/utils/parseErrorMessage';
import {
  RegisterJobPreRegistrationFormSchema,
  type PreRegistrationFormValues,
  type PreRegistrationSubmitValues,
} from '../utils/pre-registration-schema';
import { PhoneInput } from '@/components/ui/PhoneInput';

type EditableField = 'name' | 'email' | 'phone' | 'group';
const EDITABLE_FIELDS: EditableField[] = ['name', 'email', 'phone', 'group'];

const toUndefinedWhenBlank = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

function FieldErrorMessage({ error }: { error?: FieldError }) {
  if (!error) return null;
  return (
    <p
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
    >
      <AlertCircle className="size-3.5 shrink-0" />
      <span>{error.message}</span>
    </p>
  );
}

export function PreRegistrationFormFields({
  preRegForm,
  password,
  onSuccess,
}: {
  preRegForm: PreRegistrationForm;
  password: string;
  onSuccess: (data: PreRegistrationSuccessData) => void;
}) {
  const t = useTranslations('PreRegistration');
  const [formError, setFormError] = useState<string | null>(null);

  const [submitMutation, { isLoading: isSubmittingMutation }] =
    useSubmitPreRegistrationMutation();

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<PreRegistrationFormValues, unknown, PreRegistrationSubmitValues>({
    resolver: zodResolver(RegisterJobPreRegistrationFormSchema),
    defaultValues: {
      password,
      name: '',
      email: undefined,
      phone: undefined,
      group: undefined,
    },
  });

  const isSubmitting = isFormSubmitting || isSubmittingMutation;
  const selectedGroup = watch('group');

  const applyServerErrors = (fieldErrors: PreRegistrationValidationIssue[]) => {
    const unmapped: string[] = [];
    for (const issue of fieldErrors) {
      const field = issue.path[0];
      if (field && (EDITABLE_FIELDS as string[]).includes(field)) {
        setError(field as EditableField, {
          type: 'server',
          message: issue.message,
        });
      } else {
        unmapped.push(issue.message);
      }
    }
    if (unmapped.length > 0) {
      setFormError(unmapped.join(' '));
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const response = await submitMutation(values).unwrap();
      const data = response.data;
      onSuccess({
        accessCardPassword: data.accessCard.password,
        group: data.accessCard.group,
        redirectLink: data.redirectLink,
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = (error as { data?: PreRegistrationFormError }).data;
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          applyServerErrors(errorData.errors);
          return;
        }
      }
      setFormError(parseErrorMessage(error, 'An unexpected error occurred.'));
    }
  });

  const hasGroupChoices =
    preRegForm.selectable && preRegForm.selectableGroups.length > 0;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <input type="hidden" {...register('password')} />

      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {t('completeRegistration')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('contactDetailsDesc')}
        </p>
      </div>

      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
          <span>{formError}</span>
        </div>
      )}

      {/* Name Input */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          {t('fullName')} <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1.5">
          <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            id="name"
            type="text"
            placeholder={t('fullNamePlaceholder')}
            aria-invalid={errors.name ? 'true' : undefined}
            className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 transition-all focus:bg-white focus:outline-none focus:ring-4 dark:bg-slate-900 dark:text-slate-100 ${
              errors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                : 'border-slate-200 focus:border-brand focus:ring-brand/10 dark:border-slate-800'
            }`}
            {...register('name')}
          />
        </div>
        <FieldErrorMessage error={errors.name} />
      </div>

      {/* Email Input */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {t('emailAddress')}
          </label>
          <span className="text-[11px] text-slate-400">{t('optional')}</span>
        </div>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            id="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            aria-invalid={errors.email ? 'true' : undefined}
            className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 transition-all focus:bg-white focus:outline-none focus:ring-4 dark:bg-slate-900 dark:text-slate-100 ${
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                : 'border-slate-200 focus:border-brand focus:ring-brand/10 dark:border-slate-800'
            }`}
            {...register('email', { setValueAs: toUndefinedWhenBlank })}
          />
        </div>
        <FieldErrorMessage error={errors.email} />
      </div>

      {/* Phone Input */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="phone"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {t('phoneNumber')}
          </label>
          <span className="text-[11px] text-slate-400">{t('optional')}</span>
        </div>
        <div className="mt-1.5">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                defaultCountry="DE"
                value={field.value ?? undefined}
                onChange={(val) => field.onChange(toUndefinedWhenBlank(val))}
              />
            )}
          />
        </div>
        <FieldErrorMessage error={errors.phone} />
      </div>

      {/* Group Radio Cards */}
      {hasGroupChoices && (
        <fieldset className="space-y-2 pt-1">
          <legend className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t('selectGroup')}
          </legend>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {preRegForm.selectableGroups.map((group) => {
              const isChecked = selectedGroup === group;
              return (
                <label
                  key={group}
                  className={`relative flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                    isChecked
                      ? 'border-brand bg-brand/5 ring-2 ring-brand/20 dark:bg-brand/10'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {group}
                  </span>
                  <input
                    type="radio"
                    value={group}
                    className="sr-only"
                    {...register('group', { setValueAs: toUndefinedWhenBlank })}
                  />
                  {isChecked && <CheckCircle2 className="size-4 text-brand" />}
                </label>
              );
            })}
          </div>
          <FieldErrorMessage error={errors.group} />
        </fieldset>
      )}

      <button className="w-fit inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand hover:opacity-70 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand/90 focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:opacity-50 mt-2 relative overflow-hidden group">
        <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
        <span className="relative">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            <>
              <span>{t('submit')}</span>
            </>
          )}
        </span>
      </button>
    </form>
  );
}

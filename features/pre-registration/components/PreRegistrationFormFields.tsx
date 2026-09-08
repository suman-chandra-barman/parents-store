'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import type { PreRegistrationForm } from '../types/pre-registration';
import type { PreRegistrationSuccessData } from '../types/pre-registration';
import {
  PreRegistrationApiError,
  submitPreRegistration,
} from '../utils/pre-registration-api';
import {
  RegisterJobPreRegistrationFormSchema,
  type PreRegistrationFormValues,
  type PreRegistrationSubmitValues,
} from '../utils/pre-registration-schema';

type EditableField = 'name' | 'email' | 'phone' | 'group';

/** Fields the backend can report validation issues for. */
const EDITABLE_FIELDS: EditableField[] = ['name', 'email', 'phone', 'group'];

const TEXT_FIELDS: ReadonlyArray<{
  name: EditableField;
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder: string;
  optional?: boolean;
}> = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'John Doe' },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'john@example.com',
    optional: true,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: '+1234567890',
    optional: true,
  },
];

const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50';
const labelClass = 'mb-1 block text-sm font-medium';

/** Optional inputs send `undefined` when left blank instead of an empty string. */
const toUndefinedWhenBlank = (value: string) => {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

function FieldError({ error }: { error?: FieldError }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-destructive">
      {error.message}
    </p>
  );
}

export function PreRegistrationFormFields({
  preRegForm,
  password,
  onSuccess,
}: {
  preRegForm: PreRegistrationForm;
  /** Password used to unlock the form; submitted alongside the fields. */
  password: string;
  onSuccess: (data: PreRegistrationSuccessData) => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PreRegistrationFormValues, unknown, PreRegistrationSubmitValues>({
    resolver: zodResolver(RegisterJobPreRegistrationFormSchema),
    defaultValues: { password, name: '', email: undefined, phone: undefined, group: undefined },
  });

  const applyServerErrors = (error: PreRegistrationApiError) => {
    const unmapped: string[] = [];

    for (const issue of error.fieldErrors) {
      const field = issue.path[0];
      if (field && (EDITABLE_FIELDS as string[]).includes(field)) {
        setError(field as EditableField, { type: 'server', message: issue.message });
      } else {
        unmapped.push(issue.message);
      }
    }

    // Issues that cannot target an input (or the whole request failed) are
    // shown once at the top of the form.
    if (unmapped.length > 0) {
      setFormError(unmapped.join(' '));
    } else if (error.fieldErrors.length === 0) {
      setFormError(error.message || 'Failed to submit registration.');
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      const success = await submitPreRegistration(values);
      onSuccess(success);
    } catch (error: unknown) {
      if (error instanceof PreRegistrationApiError) {
        applyServerErrors(error);
      } else {
        setFormError(
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
        );
      }
    }
  });

  const hasGroupChoices =
    preRegForm.selectable && preRegForm.selectableGroups.length > 0;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* The password unlocks the form and travels with the submission. */}
      <input type="hidden" {...register('password')} />

      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{preRegForm.title}</h2>
        <div
          className="prose prose-sm max-w-none text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: preRegForm.notes }}
        />
      </div>

      {preRegForm.noticeTitle && (
        <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3">
          <p className="font-medium text-amber-700">{preRegForm.noticeTitle}</p>
          <div
            className="prose prose-sm mt-1 max-w-none text-sm text-amber-600"
            dangerouslySetInnerHTML={{ __html: preRegForm.noticeInformation }}
          />
        </div>
      )}

      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {TEXT_FIELDS.map((field) => (
        <div key={field.name} className="space-y-1">
          <label className={labelClass} htmlFor={field.name}>
            {field.label}
            {field.optional && (
              <span className="font-normal text-muted-foreground"> (optional)</span>
            )}
          </label>
          <input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            aria-invalid={errors[field.name] ? 'true' : undefined}
            className={inputClass}
            {...register(
              field.name,
              field.optional ? { setValueAs: toUndefinedWhenBlank } : undefined,
            )}
          />
          <FieldError error={errors[field.name]} />
        </div>
      ))}

      {hasGroupChoices && (
        <div className="space-y-1">
          <label className={labelClass} htmlFor="group">
            Group
          </label>
          <select
            id="group"
            aria-invalid={errors.group ? 'true' : undefined}
            className={inputClass}
            {...register('group', { setValueAs: toUndefinedWhenBlank })}
          >
            <option value="">Select your group</option>
            {preRegForm.selectableGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <FieldError error={errors.group} />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isSubmitting ? 'Submitting…' : 'Submit Registration'}
      </button>
    </form>
  );
}

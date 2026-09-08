import { env } from '@/config/env';
import type {
  PreRegistrationForm,
  PreRegistrationFormError,
  PreRegistrationFormResponse,
  PreRegistrationSuccessData,
  PreRegistrationSubmitResponse,
  PreRegistrationValidationIssue,
} from '../types/pre-registration';
import type { PreRegistrationSubmitValues } from './pre-registration-schema';

/**
 * API error that also carries any per-field validation issues returned by the
 * backend so the form can surface them under the matching inputs.
 */
export class PreRegistrationApiError extends Error {
  readonly statusCode?: number;
  readonly fieldErrors: PreRegistrationValidationIssue[];

  constructor(
    message: string,
    statusCode?: number,
    fieldErrors: PreRegistrationValidationIssue[] = [],
  ) {
    super(message);
    this.name = 'PreRegistrationApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}

async function toApiError(response: Response): Promise<PreRegistrationApiError> {
  let body: PreRegistrationFormError | undefined;
  try {
    body = (await response.json()) as PreRegistrationFormError;
  } catch {
    // Non-JSON body — fall back to the HTTP status below.
  }

  return new PreRegistrationApiError(
    body?.message ?? `Request failed with status ${response.status}`,
    body?.statusCode ?? response.status,
    body?.errors ?? [],
  );
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchPreRegistrationForm(
  password: string,
): Promise<PreRegistrationForm> {
  const response = await fetch(
    `${env.baseUrl}/job-pre-registration-form/by-password/${encodeURIComponent(password)}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } },
  );

  if (!response.ok) throw await toApiError(response);

  const body = await readJson<PreRegistrationFormResponse>(response);
  return body.data;
}

export async function submitPreRegistration(
  values: PreRegistrationSubmitValues,
): Promise<PreRegistrationSuccessData> {
  const response = await fetch(`${env.baseUrl}/job-pre-registration-form/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!response.ok) throw await toApiError(response);

  const body = await readJson<PreRegistrationSubmitResponse>(response);
  return {
    accessCardPassword: body.data.accessCard.password,
    group: body.data.accessCard.group,
    redirectLink: body.data.redirectLink,
  };
}

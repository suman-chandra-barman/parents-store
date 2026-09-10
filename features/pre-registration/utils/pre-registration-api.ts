import axios from 'axios';
import { apiClient } from '@/lib/api-client';
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

function handleAxiosError(error: unknown): PreRegistrationApiError {
  if (axios.isAxiosError(error)) {
    const errorBody = error.response?.data as PreRegistrationFormError | undefined;
    return new PreRegistrationApiError(
      errorBody?.message ?? error.message ?? `Request failed with status ${error.response?.status}`,
      errorBody?.statusCode ?? error.response?.status,
      errorBody?.errors ?? [],
    );
  }
  return new PreRegistrationApiError(
    error instanceof Error ? error.message : 'An unexpected error occurred',
  );
}

export async function fetchPreRegistrationForm(
  password: string,
): Promise<PreRegistrationForm> {
  try {
    const response = await apiClient.get<PreRegistrationFormResponse>(
      `/job-pre-registration-form/by-password/${encodeURIComponent(password)}`,
    );
    return response.data.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function submitPreRegistration(
  values: PreRegistrationSubmitValues,
): Promise<PreRegistrationSuccessData> {
  try {
    const response = await apiClient.post<PreRegistrationSubmitResponse>(
      '/job-pre-registration-form/register',
      values,
    );
    const data = response.data.data;
    return {
      accessCardPassword: data.accessCard.password,
      group: data.accessCard.group,
      redirectLink: data.redirectLink,
    };
  } catch (error) {
    throw handleAxiosError(error);
  }
}

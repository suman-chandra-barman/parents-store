import { env } from "@/config/env";
import {
  PreRegistrationFormResponse,
  PreRegistrationSubmitResponse,
  PreRegistrationFormError,
} from "../types/pre-registration";

export async function fetchPreRegistrationForm(
  password: string
): Promise<PreRegistrationFormResponse> {
  const response = await fetch(
    `${env.baseUrl}/job-pre-registration-form/by-password/${encodeURIComponent(password)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData: PreRegistrationFormError = await response.json();
    throw new Error(errorData.message || "Failed to fetch pre-registration form");
  }

  const data: PreRegistrationFormResponse = await response.json();
  return data;
}

export async function submitPreRegistration(
  data: {
    password: string;
    name: string;
    email: string;
    phone: string;
    group: string;
  }
): Promise<PreRegistrationSubmitResponse> {
  const response = await fetch(`${env.baseUrl}/job-pre-registration-form/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: PreRegistrationFormError = await response.json();
    throw new Error(errorData.message || "Failed to submit pre-registration");
  }

  const result: PreRegistrationSubmitResponse = await response.json();
  return result;
}

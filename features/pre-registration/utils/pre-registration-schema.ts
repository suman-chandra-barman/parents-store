import { z } from 'zod';

/**
 * Zod validation schema for the Pre-Registration Form.
 */
export const RegisterJobPreRegistrationFormSchema = z.object({
  /** Access code password */
  password: z
    .string()
    .min(1, 'Password is required')
    .trim(),

  /** User full name */
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),

  /** User email (optional or nullish) */
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .nullish()
    .or(z.literal('')),

  /** User phone number (optional or nullish) */
  phone: z
    .string()
    .trim()
    .nullish()
    .or(z.literal('')),

  /** User group, must be one of the selectable groups of the form */
  group: z
    .string()
    .trim()
    .nullish()
    .or(z.literal('')),
});

/** Raw form values (what the user types, before parsing). */
export type PreRegistrationFormValues = z.input<
  typeof RegisterJobPreRegistrationFormSchema
>;

/** Parsed values handed to the submit handler (trimmed / normalized). */
export type PreRegistrationSubmitValues = z.output<
  typeof RegisterJobPreRegistrationFormSchema
>;

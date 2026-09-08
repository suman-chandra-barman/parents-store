import { sharedDtoSchema as _ } from '@/common/dto/sharedDtoSchema';
import z from 'zod';

/**
 * Mirrors the backend register DTO so the client and the server validate
 * registrations with the exact same rules.
 */
export const RegisterJobPreRegistrationFormSchema = z.object({
  password: _.accessCodePassword,

  /** user name */
  name: _.name({ field: 'name' }),

  /** user email */
  email: _.email().nullish(),

  /** user phone number */
  phone: _.phone().nullish(),

  /** user group, must be one of the selectable groups of the form */
  group: _.name({ field: 'group' }).nullish(),
});

/** Raw form values (what the user types, before parsing). */
export type PreRegistrationFormValues = z.input<
  typeof RegisterJobPreRegistrationFormSchema
>;

/** Parsed values handed to the submit handler (trimmed / normalized). */
export type PreRegistrationSubmitValues = z.output<
  typeof RegisterJobPreRegistrationFormSchema
>;

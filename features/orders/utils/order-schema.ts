import { z } from "zod";

export const orderCustomerSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "NOT_SPECIFIED"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  addressLine1: z.string().min(1, "Street address is required"),
  note: z.string().min(1, "Apartment or address note is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
  country: z.string().min(1, "Country is required"),
  customerNotes: z.string().optional(),
});

export type OrderCustomerFormData = z.infer<typeof orderCustomerSchema>;

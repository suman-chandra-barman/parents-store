import { z } from "zod";

export const AddressFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().max(100).optional(),
  companyName: z.string().trim().max(100).optional(),
  gender: z.enum(["MALE", "FEMALE", "NOT_SPECIFIED"]).optional(),
  country: z.string().trim().min(1, "Country / Region is required"),
  state: z.string().trim().min(1, "State is required"),
  city: z.string().trim().min(1, "Town / City is required"),
  zipCode: z.string().trim().min(1, "ZIP Code is required"),
  addressLine1: z.string().trim().min(1, "Street address is required"),
  note: z.string().trim().optional(),
});

export const OptionalAddressFormSchema = z.object({
  firstName: z.string().trim().max(100).optional(),
  lastName: z.string().trim().max(100).optional(),
  companyName: z.string().trim().max(100).optional(),
  gender: z.enum(["MALE", "FEMALE", "NOT_SPECIFIED"]).optional(),
  country: z.string().trim().optional(),
  state: z.string().trim().optional(),
  city: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),
  addressLine1: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

export const CheckoutFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    phone: z.string().trim().optional().or(z.literal("")),
    billingAddress: AddressFormSchema,
    shipToDifferentAddress: z.boolean(),
    deliveryAddress: OptionalAddressFormSchema.optional(),
    customerNotes: z
      .string()
      .trim()
      .max(2000, "Notes cannot exceed 2000 characters")
      .optional()
      .or(z.literal("")),
    paymentMethod: z.enum(["CREDIT_CARD", "PAYPAL"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shipToDifferentAddress) {
      if (!data.deliveryAddress?.firstName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Delivery first name is required",
          path: ["deliveryAddress", "firstName"],
        });
      }
      if (!data.deliveryAddress?.addressLine1?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Delivery street address is required",
          path: ["deliveryAddress", "addressLine1"],
        });
      }
      if (!data.deliveryAddress?.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Delivery city is required",
          path: ["deliveryAddress", "city"],
        });
      }
      if (!data.deliveryAddress?.state?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Delivery state is required",
          path: ["deliveryAddress", "state"],
        });
      }
      if (!data.deliveryAddress?.zipCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Delivery ZIP code is required",
          path: ["deliveryAddress", "zipCode"],
        });
      }
      if (!data.deliveryAddress?.country?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Delivery country is required",
          path: ["deliveryAddress", "country"],
        });
      }
    }
  });

export type AddressFormData = z.infer<typeof AddressFormSchema>;
export type CheckoutFormData = z.infer<typeof CheckoutFormSchema>;

import { z } from "zod";

/**
 * Zod schema for applying gift voucher code (GV-XXXX-XXXX-XXXX-XXXX)
 */
export const ApplyGiftVoucherSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Voucher code is required")
    .regex(
      /^GV-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i,
      "Invalid gift voucher code format (Expected: GV-XXXX-XXXX-XXXX-XXXX)"
    )
    .transform((code) => code.toUpperCase()),
});

export type ApplyGiftVoucherFormData = z.infer<typeof ApplyGiftVoucherSchema>;

/**
 * Zod schema for updating cart item quantity
 */
export const UpdateCartItemQuantitySchema = z.object({
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(9999, "Quantity is too high"),
});

export type UpdateCartItemQuantityFormData = z.infer<
  typeof UpdateCartItemQuantitySchema
>;

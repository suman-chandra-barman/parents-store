import { z } from "zod";

/**
 * Validation schema for getting packages by photo IDs
 */
export const GetPackagesByPhotoIdsBodySchema = z.object({
  photoIds: z
    .array(z.string().min(1, "Invalid Photo ID"))
    .min(1, "At least one photo ID is required"),
});

export type GetPackagesByPhotoIdsBody = z.infer<
  typeof GetPackagesByPhotoIdsBodySchema
>;

/**
 * Validation schema for filtering photos by format ID
 */
export const FilterPhotosByFormatBodySchema = z.object({
  photoIds: z
    .array(z.string().min(1, "Invalid Photo ID"))
    .min(1, "At least one photo ID is required"),
});

export type FilterPhotosByFormatBody = z.infer<
  typeof FilterPhotosByFormatBodySchema
>;

/**
 * Validation schema for Package customization form
 */
export const PackageCustomizationFormSchema = z.object({
  formatId: z.string().min(1, "Package format is required"),
  // Map of slotId -> array of selected photo IDs
  slotSelections: z.record(z.string(), z.array(z.string())),
  upgradeDigital: z.boolean().optional(),
});

export type PackageCustomizationFormData = z.infer<
  typeof PackageCustomizationFormSchema
>;

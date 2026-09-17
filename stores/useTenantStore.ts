import { create } from "zustand";
import type { Tenant, TenantState } from "./useTenantStore.types";
import { env } from "@/config/env";
import { ApiResponse } from "@/common/types";

export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  isLoading: false,
  error: null,

  setTenant: (tenant) =>
    set({
      tenant,
      isLoading: false,
      error: null,
    }),

  fetchTenant: async (slug: string) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const tenant = await fetchTenant(slug);

      set({
        tenant,
        isLoading: false,
        error: tenant ? null : "Tenant not found",
      });
    } catch (error) {
      set({
        tenant: null,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to retrieve tenant",
      });
    }
  },

  resetTenant: () =>
    set({
      tenant: null,
      isLoading: false,
      error: null,
    }),
}));

export async function fetchTenant(slug: string): Promise<Tenant | null> {
  if (!slug) return null;

  try {
    const cleanSlug = slug.split(":")[0];
    const response = await fetch(`${env.baseUrl}/tenants/by-url/${cleanSlug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const result: ApiResponse<Tenant> = await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("fetchTenant error:", error);
    return null;
  }
}

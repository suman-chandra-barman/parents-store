import { create } from 'zustand';
import type { Tenant, TenantState } from './useTenantStore.types';
import { env } from '@/config/env';
import { ApiResponse } from '@/common/types';

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
        error: null,
      });
    } catch (error) {
      set({
        tenant: null,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to retrieve tenant',
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

export async function fetchTenant(slug: string): Promise<Tenant> {
  const response = await fetch(`${env.baseUrl}/tenants/by-url/${slug}`);

  const result: ApiResponse<Tenant> = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || 'Failed to retrieve tenant');
  }

  return result.data;
}

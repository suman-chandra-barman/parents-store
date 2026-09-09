/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { ApiResponse } from '@/common/types';
import type { TenantState } from './useTenantStore.types';
import { env } from '@/config/env';

export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  isLoading: false,
  error: null,

  setTenant: (tenant) => set({ tenant, isLoading: false, error: null }),

  fetchTenant: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${env.baseUrl}/tenants/by-url/${slug}`);
      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        set({ tenant: result.data, isLoading: false });
      } else {
        set({
          error: result.message || 'Failed to retrieve tenant',
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message || 'Network error', isLoading: false });
    }
  },

  resetTenant: () => set({ tenant: null, isLoading: false, error: null }),
}));

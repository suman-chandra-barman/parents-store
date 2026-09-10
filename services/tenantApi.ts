import { baseApi } from "@/services/baseApi";
import type { Tenant } from "@/stores/useTenantStore.types";
import type { ApiResponse } from "@/common/types";

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantByUrl: builder.query<Tenant, string>({
      query: (slug) => ({
        url: `/tenants/by-url/${encodeURIComponent(slug)}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Tenant>) => {
        if (!response?.success || !response.data) {
          throw new Error(response?.message || "Failed to retrieve tenant");
        }
        return response.data;
      },
      providesTags: ["Tenant"],
    }),
  }),
});

export const { useGetTenantByUrlQuery, useLazyGetTenantByUrlQuery } = tenantApi;

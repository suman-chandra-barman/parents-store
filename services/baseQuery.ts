import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "@/config/env";
import { useTenantStore } from "@/stores/useTenantStore";

export const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    // Attach Tenant ID to every API request
    const tenantId = useTenantStore.getState().tenant?.id;
    if (tenantId) {
      headers.set("X-Tenant-ID", tenantId);
      headers.set("x-tenant-id", tenantId);
    }
    return headers;
  },
});

export const baseQueryWithReauth = rawBaseQuery;

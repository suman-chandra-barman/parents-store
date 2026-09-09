import axios from 'axios';
import { useTenantStore } from '../stores/useTenantStore';
import { env } from '@/config/env';

export const apiClient = axios.create({
  baseURL: env.baseUrl,
});

apiClient.interceptors.request.use((config) => {
  const { tenant } = useTenantStore.getState();

  const tenantIdentifier = tenant?.slug || extractSlugFromHostname();

  if (tenantIdentifier) {
    config.headers['X-Tenant-ID'] = tenantIdentifier;
  }

  return config;
});

function extractSlugFromHostname(): string | null {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  return parts.length > 2 && parts[0] !== 'www' ? parts[0] : null;
}

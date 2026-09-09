import axios from 'axios';
import { useTenantStore } from '../stores/useTenantStore';
import { env } from '@/config/env';

export const apiClient = axios.create({
  baseURL: env.baseUrl,
});

apiClient.interceptors.request.use((config) => {
  const { tenant } = useTenantStore.getState();

  const tenantIdentifier = tenant?.id;

  if (tenantIdentifier) {
    config.headers['X-Tenant-ID'] = tenantIdentifier;
  }

  return config;
});

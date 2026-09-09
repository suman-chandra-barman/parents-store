'use client';

import React, { useEffect } from 'react';
import { useTenantStore } from '@/stores/useTenantStore';

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const tenant = useTenantStore((state) => state.tenant);
  const fetchTenant = useTenantStore((state) => state.fetchTenant);

  useEffect(() => {
    if (tenant) return;

    fetchTenant(window.location.hostname);
  }, [tenant, fetchTenant]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--brand',
      tenant?.primaryColor ?? '#2060b0',
    );
  }, [tenant?.primaryColor]);

  return <>{children}</>;
};

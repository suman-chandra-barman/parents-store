'use client';

import { useTenantStore } from '@/stores/useTenantStore';
import React, { useEffect } from 'react';

export const TenantLayout = ({ children }: { children: React.ReactNode }) => {
  const { tenant, isLoading, error, fetchTenant } = useTenantStore();

  useEffect(() => {
    const slug = window.location.hostname.split('.')[0];
    if (slug) {
      fetchTenant(slug);
    }
  }, [fetchTenant]);

  if (isLoading) return <div>Loading tenant workspace...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tenant) return <div>No tenant workspace found.</div>;

  return (
    <div
      style={
        {
          '--primary-theme-color': tenant.primaryColor || '#000',
        } as React.CSSProperties
      }
    >
      <header className="p-4 border-b flex justify-between">
        <h1 className="font-bold text-xl">{tenant.name}</h1>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
          {tenant.plan} PLAN
        </span>
      </header>
      <main>{children}</main>
    </div>
  );
};

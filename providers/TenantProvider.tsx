'use client';

import React, { useEffect } from 'react';
import { useTenantStore } from '@/stores/useTenantStore';

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { tenant, isLoading, error, fetchTenant } = useTenantStore();

  useEffect(() => {
    const hostname = window.location.hostname;

    fetchTenant(hostname);
  }, [fetchTenant]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm font-medium animate-pulse">
          Loading workspace...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-destructive">
        <p>Error loading workspace: {error}</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <p>No tenant workspace found for this URL.</p>
      </div>
    );
  }

  return <>{children}</>;
};

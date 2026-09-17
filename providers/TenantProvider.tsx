"use client";

import React, { useEffect, useRef } from "react";
import { useTenantStore } from "@/stores/useTenantStore";
import type { Tenant } from "@/stores/useTenantStore.types";

interface TenantProviderProps {
  initialTenant?: Tenant | null;
  children: React.ReactNode;
}

export const TenantProvider = ({
  initialTenant,
  children,
}: TenantProviderProps) => {
  const initialized = useRef(false);

  // Synchronously seed the store during the initial render phase
  if (!initialized.current) {
    if (initialTenant) {
      useTenantStore.setState({
        tenant: initialTenant,
        isLoading: false,
        error: null,
      });
    }
    initialized.current = true;
  }

  const tenant = useTenantStore((state) => state.tenant);
  const fetchTenant = useTenantStore((state) => state.fetchTenant);

  useEffect(() => {
    if (tenant) return;

    fetchTenant(window.location.hostname);
  }, [tenant, fetchTenant]);

  useEffect(() => {
    if (tenant?.primaryColor) {
      document.documentElement.style.setProperty(
        "--brand",
        tenant.primaryColor,
      );
    }
  }, [tenant?.primaryColor]);

  const brandColor = tenant?.primaryColor || initialTenant?.primaryColor || "#2060b0";

  return (
    <>
      <style
        id="tenant-brand-theme"
        dangerouslySetInnerHTML={{
          __html: `:root { --brand: ${brandColor}; }`,
        }}
      />
      {children}
    </>
  );
};

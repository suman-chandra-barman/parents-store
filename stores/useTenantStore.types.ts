import { Media } from '@/common/types';
import type { TenantPlan, TenantStatus } from '../common/enum';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  timezone: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  logoId: string | null;
  logo: Media | null;
  primaryColor: string | null;
  customDomain: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TenantState {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTenant: (tenant: Tenant) => void;
  fetchTenant: (slug: string) => Promise<void>;
  resetTenant: () => void;
}

import type { TenantInfo } from '../types';

// Mock tenant data for testing
export const getMockTenantData = (): TenantInfo => {
  return {
    id: 'acme-corporation',
    tenantId: 'acme-corporation',
    companyName: 'Acme Corporation',
    status: 'free-trial',
    plan: 'free-trial',
    createdAt: '2024-12-01T00:00:00Z',
    trialExpiresAt: '2025-01-01T00:00:00Z',
    instanceUrl: 'https://acme-corporation.moamalat.app',
    usage: {
      documentsUploaded: 127,
      correspondenceCreated: 89,
      usersCount: 5
    }
  };
};

// Simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTenants: TenantInfo[] = [
  getMockTenantData(),
  {
    id: 'tech-startup',
    tenantId: 'tech-startup',
    companyName: 'Tech Startup Inc',
    status: 'active',
    plan: 'professional',
    createdAt: '2024-11-15T00:00:00Z',
    instanceUrl: 'https://tech-startup.dataserve.app',
    usage: {
      documentsUploaded: 245,
      correspondenceCreated: 156,
      usersCount: 12
    }
  }
];

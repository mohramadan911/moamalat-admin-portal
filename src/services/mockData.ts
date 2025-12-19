import { TenantInfo } from '../types';

// Mock tenant data for testing
export const getMockTenantData = (): TenantInfo => {
  return {
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

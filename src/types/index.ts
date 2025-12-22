export interface User {
  email: string;
  name: string;
  tenantId?: string;
  tenantRole?: string;
  tenantStatus?: string;
}

export interface TenantInfo {
  id: string;
  tenantId: string;
  companyName: string;
  status: 'free-trial' | 'paid' | 'suspended' | 'active';
  plan: 'free-trial' | 'standard' | 'enterprise' | 'professional';
  createdAt: string;
  trialExpiresAt?: string;
  instanceUrl: string;
  adminEmail?: string;
  adminName?: string;
  phone?: string;
  industry?: string;
  usage: {
    documentsUploaded: number;
    correspondenceCreated: number;
    usersCount: number;
  };
}

export interface RegistrationData {
  companyName: string;
  adminEmail: string;
  adminName: string;
  plan: 'free-trial' | 'standard' | 'enterprise';
  acceptTerms: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  tenantId: string;
  instanceUrl: string;
  adminUsername: string;
  message: string;
}

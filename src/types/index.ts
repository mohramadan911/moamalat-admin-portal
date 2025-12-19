export interface User {
  email: string;
  name: string;
  tenantId?: string;
  tenantRole?: string;
  tenantStatus?: string;
}

export interface TenantInfo {
  tenantId: string;
  companyName: string;
  status: 'free-trial' | 'paid' | 'suspended';
  plan: 'free-trial' | 'standard' | 'enterprise';
  createdAt: string;
  trialExpiresAt?: string;
  instanceUrl: string;
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
  password: string;
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

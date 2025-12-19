import { registerTenant } from './api';
import type { RegistrationData, RegistrationResponse } from '../types';

export const createTenant = async (data: RegistrationData): Promise<RegistrationResponse> => {
  try {
    // Call the registration API
    const response = await registerTenant(data);
    
    // Store registration info for later use
    sessionStorage.setItem('registrationData', JSON.stringify({
      email: data.adminEmail,
      companyName: data.companyName,
      tenantId: response.tenantId,
      instanceUrl: response.instanceUrl
    }));

    return response;
  } catch (error) {
    console.error('Tenant creation failed:', error);
    throw error;
  }
};

export const getRegistrationData = () => {
  const data = sessionStorage.getItem('registrationData');
  return data ? JSON.parse(data) : null;
};

export const clearRegistrationData = () => {
  sessionStorage.removeItem('registrationData');
};

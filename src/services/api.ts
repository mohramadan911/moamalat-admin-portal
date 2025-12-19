import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { RegistrationData, RegistrationResponse, TenantInfo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Failed to get auth token:', error);
  }
  return config;
});

// Registration API
export const registerTenant = async (data: RegistrationData): Promise<RegistrationResponse> => {
  try {
    const response = await apiClient.post('/api/registration/tenant', {
      companyName: data.companyName,
      adminEmail: data.adminEmail,
      adminName: data.adminName,
      plan: data.plan
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Get tenant info
export const getTenantInfo = async (): Promise<TenantInfo> => {
  try {
    const response = await apiClient.get('/api/tenant/info');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to get tenant info');
  }
};

export default apiClient;

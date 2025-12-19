import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import TenantCard from '../components/dashboard/TenantCard';
import UsageStats from '../components/dashboard/UsageStats';
import QuickActions from '../components/dashboard/QuickActions';
import { TenantInfo } from '../types';
import { getTenantInfo } from '../services/api';
import { getMockTenantData } from '../services/mockData';

export default function Dashboard() {
  const { user } = useAuth();
  const [tenantData, setTenantData] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    try {
      // Try to get real data from API
      const data = await getTenantInfo();
      setTenantData(data);
    } catch (err: any) {
      console.warn('Failed to load tenant data from API, using mock data:', err);
      // Fallback to mock data for testing
      const mockData = getMockTenantData();
      setTenantData(mockData);
      setError('Using demo data. Connect to API for real data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!tenantData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Failed to load tenant data. Please try again.</p>
          <button
            onClick={loadTenantData}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Admin'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your MOAMALAT instance
          </p>
          {error && (
            <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Tenant Information */}
        <TenantCard tenant={tenantData} />

        {/* Usage Statistics */}
        <UsageStats usage={tenantData.usage} />

        {/* Quick Actions */}
        <QuickActions instanceUrl={tenantData.instanceUrl} />
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTenantInfo } from '../services/api';
import { mockTenants } from '../services/mockData';
import TenantCard from '../components/dashboard/TenantCard';
import type { TenantInfo } from '../types';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await getTenantInfo();
        setTenants(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
        // Fallback to mock data
        setTenants(mockTenants);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="header-shell">
          <div className="header">
            <h1 className="header-title">DataServe Dashboard</h1>
          </div>
        </div>
        <div className="app-main">
          <div className="chat-area">
            <div className="chat-panel">
              <div className="bubble text-center">
                <div className="typing">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <p className="mt-4 text-text-dim">Loading your dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="header-shell">
        <div className="header">
          <h1 className="header-title">DataServe Dashboard</h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-text-dim">Welcome, {user?.name || user?.email}</span>
            <button onClick={handleLogout} className="button subtle">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="app-main">
        <div className="chat-area">
          <div className="chat-panel">
            <div className="mb-8">
              <div className="bubble">
                <div className="mini-role-tag">
                  <span>System Status</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to DataServe</h2>
                <p className="text-text-dim">
                  Manage your tenants, monitor usage, and track performance from this central dashboard.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="bubble">
                <h3 className="text-lg font-semibold mb-4">Usage Overview</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {tenants.reduce((sum, t) => sum + (t.usage?.documentsUploaded || 0), 0)}
                    </div>
                    <div className="text-sm text-text-dim">Documents</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {tenants.reduce((sum, t) => sum + (t.usage?.usersCount || 0), 0)}
                    </div>
                    <div className="text-sm text-text-dim">Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{tenants.length}</div>
                    <div className="text-sm text-text-dim">Tenants</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="structured-response">
              <div className="answer-section">
                <h3 className="text-xl font-semibold mb-4 text-text">Active Tenants</h3>
                {tenants.length === 0 ? (
                  <div className="bubble text-center">
                    <p className="text-text-dim">No tenants found. Create your first tenant to get started.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tenants.map((tenant) => (
                      <TenantCard key={tenant.id} tenant={tenant} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

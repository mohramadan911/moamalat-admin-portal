import type { TenantInfo } from '../../types';

interface TenantCardProps {
  tenant: TenantInfo;
}

export default function TenantCard({ tenant }: TenantCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free-trial':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your MOAMALAT Instance</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tenant.status)}`}>
          {tenant.status === 'free-trial' ? 'Free Trial' : tenant.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Company Name</label>
            <p className="text-lg font-semibold text-gray-900">{tenant.companyName}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Tenant ID</label>
            <p className="text-lg font-mono text-gray-900">{tenant.tenantId}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Plan</label>
            <p className="text-lg font-semibold text-gray-900 capitalize">{tenant.plan.replace('-', ' ')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Instance URL</label>
            <a 
              href={tenant.instanceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg text-blue-600 hover:text-blue-800 break-all"
            >
              {tenant.instanceUrl}
            </a>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Created</label>
            <p className="text-lg text-gray-900">{formatDate(tenant.createdAt)}</p>
          </div>

          {tenant.trialExpiresAt && (
            <div>
              <label className="text-sm font-medium text-gray-500">Trial Expires</label>
              <p className="text-lg text-orange-600 font-semibold">{formatDate(tenant.trialExpiresAt)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

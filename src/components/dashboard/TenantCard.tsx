import { ExternalLink, Building2, Calendar, CreditCard, Globe, Hash } from 'lucide-react';
import type { TenantInfo } from '../../types';

interface TenantCardProps {
  tenant: TenantInfo;
}

export default function TenantCard({ tenant }: TenantCardProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'free-trial':
        return {
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa'
        };
      case 'paid':
      case 'active':
      case 'professional':
        return {
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399'
        };
      case 'suspended':
        return {
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171'
        };
      default:
        return {
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: '#a78bfa'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatStatus = (status: string) => {
    if (status === 'free-trial') return 'Free Trial';
    if (status === 'paid') return 'Active';
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  const handleOpenInstance = () => {
    window.open(tenant.instanceUrl, '_blank', 'noopener,noreferrer');
  };

  const statusStyles = getStatusStyles(tenant.status);

  return (
    <div 
      onClick={handleOpenInstance}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '1.75rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 style={{ width: '22px', height: '22px', color: 'white' }} />
          </div>
          <div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: 'white',
              margin: 0
            }}>
              {tenant.companyName}
            </h3>
            <p style={{ 
              fontSize: '0.8125rem', 
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0
            }}>
              MOAMALAT Instance
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <span style={{
          padding: '0.375rem 0.875rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          ...statusStyles
        }}>
          {formatStatus(tenant.status)}
        </span>
      </div>

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Tenant ID */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '12px',
          padding: '0.875rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <Hash style={{ width: '14px', height: '14px', color: 'rgba(255, 255, 255, 0.4)' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500' }}>
              Tenant ID
            </span>
          </div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'white', 
            fontFamily: 'monospace',
            margin: 0,
            wordBreak: 'break-all'
          }}>
            {tenant.tenantId}
          </p>
        </div>

        {/* Plan */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '12px',
          padding: '0.875rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <CreditCard style={{ width: '14px', height: '14px', color: 'rgba(255, 255, 255, 0.4)' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500' }}>
              Plan
            </span>
          </div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'white', 
            fontWeight: '600',
            margin: 0,
            textTransform: 'capitalize'
          }}>
            {tenant.plan.replace('-', ' ')}
          </p>
        </div>

        {/* Created Date */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '12px',
          padding: '0.875rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <Calendar style={{ width: '14px', height: '14px', color: 'rgba(255, 255, 255, 0.4)' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500' }}>
              Created
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'white', margin: 0 }}>
            {formatDate(tenant.createdAt)}
          </p>
        </div>

        {/* Trial Expires or Instance URL */}
        {tenant.trialExpiresAt ? (
          <div style={{
            background: 'rgba(251, 146, 60, 0.1)',
            borderRadius: '12px',
            padding: '0.875rem',
            border: '1px solid rgba(251, 146, 60, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <Calendar style={{ width: '14px', height: '14px', color: '#fb923c' }} />
              <span style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: '500' }}>
                Trial Expires
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#fdba74', fontWeight: '600', margin: 0 }}>
              {formatDate(tenant.trialExpiresAt)}
            </p>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            padding: '0.875rem',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <Globe style={{ width: '14px', height: '14px', color: 'rgba(255, 255, 255, 0.4)' }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500' }}>
                Status
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#34d399', fontWeight: '600', margin: 0 }}>
              Active
            </p>
          </div>
        )}
      </div>

      {/* Instance URL */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '12px',
        padding: '0.875rem',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <Globe style={{ width: '14px', height: '14px', color: '#a78bfa' }} />
          <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: '500' }}>
            Instance URL
          </span>
        </div>
        <p style={{ 
          fontSize: '0.875rem', 
          color: '#c4b5fd', 
          margin: 0,
          wordBreak: 'break-all'
        }}>
          {tenant.instanceUrl}
        </p>
      </div>

      {/* Open Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        color: '#a78bfa',
        fontWeight: '600',
        fontSize: '0.875rem',
        transition: 'all 0.2s'
      }}>
        <ExternalLink style={{ width: '16px', height: '16px' }} />
        <span>Open MOAMALAT Instance</span>
      </div>
    </div>
  );
}
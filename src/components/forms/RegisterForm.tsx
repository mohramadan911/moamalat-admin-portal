import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Mail, CreditCard, ArrowRight, CheckCircle, Copy } from 'lucide-react';
import { createTenant } from '../../services/registration';
import type { RegistrationData } from '../../types';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>();

  const onSubmit = async (data: RegistrationData) => {
    setLoading(true);
    setError('');

    try {
      await createTenant(data);
      setRegisteredEmail(data.adminEmail);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  if (success) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <CheckCircle style={{
          width: '64px',
          height: '64px',
          color: '#10b981',
          margin: '0 auto 1.5rem'
        }} />
        
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'white',
          marginBottom: '1rem'
        }}>
          Registration Successful!
        </h2>
        
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '2rem'
        }}>
          Your account has been created. Use these temporary credentials to log in:
        </p>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '0.5rem'
            }}>
              Username (Email):
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: 'white', flex: 1, fontFamily: 'monospace' }}>
                {registeredEmail}
              </span>
              <button
                onClick={() => copyToClipboard(registeredEmail)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <Copy style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '0.5rem'
            }}>
              Temporary Password:
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ color: 'white', flex: 1, fontFamily: 'monospace' }}>
                TempPass123!
              </span>
              <button
                onClick={() => copyToClipboard('TempPass123!')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <Copy style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </div>
        
        <p style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: '2rem'
        }}>
          You'll be prompted to change your password on first login.
        </p>
        
        <button
          onClick={goToLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.875rem 2rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.9375rem',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            margin: '0 auto'
          }}
        >
          <span>Go to Login</span>
          <ArrowRight style={{ width: '20px', height: '20px' }} />
        </button>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#f87171',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '0.5rem'
          }}>
            Company Name *
          </label>
          <div style={{ position: 'relative' }}>
            <Building2 style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'rgba(255, 255, 255, 0.4)'
            }} />
            <input
              {...register('companyName', { required: 'Company name is required' })}
              type="text"
              placeholder="Enter your company name"
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.9375rem',
                outline: 'none'
              }}
            />
          </div>
          {errors.companyName && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#f87171' }}>
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '0.5rem'
          }}>
            Full Name *
          </label>
          <div style={{ position: 'relative' }}>
            <User style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'rgba(255, 255, 255, 0.4)'
            }} />
            <input
              {...register('adminName', { required: 'Full name is required' })}
              type="text"
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.9375rem',
                outline: 'none'
              }}
            />
          </div>
          {errors.adminName && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#f87171' }}>
              {errors.adminName.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '0.5rem'
          }}>
            Email Address *
          </label>
          <div style={{ position: 'relative' }}>
            <Mail style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'rgba(255, 255, 255, 0.4)'
            }} />
            <input
              {...register('adminEmail', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              placeholder="you@company.com"
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.9375rem',
                outline: 'none'
              }}
            />
          </div>
          {errors.adminEmail && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#f87171' }}>
              {errors.adminEmail.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '0.5rem'
          }}>
            Select Plan *
          </label>
          <div style={{ position: 'relative' }}>
            <CreditCard style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'rgba(255, 255, 255, 0.4)'
            }} />
            <select
              {...register('plan', { required: 'Please select a plan' })}
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.9375rem',
                outline: 'none'
              }}
            >
              <option value="" style={{ background: '#1a1a1a', color: 'white' }}>Choose your plan</option>
              <option value="free-trial" style={{ background: '#1a1a1a', color: 'white' }}>Free Trial (14 days)</option>
              <option value="standard" style={{ background: '#1a1a1a', color: 'white' }}>Standard ($29/month)</option>
              <option value="enterprise" style={{ background: '#1a1a1a', color: 'white' }}>Enterprise ($99/month)</option>
            </select>
          </div>
          {errors.plan && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#f87171' }}>
              {errors.plan.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}>
            <input
              {...register('acceptTerms', { required: 'You must accept the terms and conditions' })}
              type="checkbox"
              style={{ marginTop: '0.125rem' }}
            />
            <span>
              I agree to the{' '}
              <a href="#" style={{ color: '#a78bfa', textDecoration: 'none' }}>
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" style={{ color: '#a78bfa', textDecoration: 'none' }}>
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.acceptTerms && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#f87171' }}>
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.875rem 2rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.9375rem',
            borderRadius: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
          }}
        >
          <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          {!loading && <ArrowRight style={{ width: '20px', height: '20px' }} />}
        </button>
      </form>
    </>
  );
}

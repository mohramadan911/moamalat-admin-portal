import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Lock, CreditCard, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createTenant } from '../../services/registration';
import type { RegistrationData } from '../../types';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
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
      // First create the tenant via API
      await createTenant(data);
      
      // Then create the Cognito user
      await signup(data.adminEmail, data.password, data.adminName);
      
      // Store email for verification page
      sessionStorage.setItem('registrationEmail', data.adminEmail);
      sessionStorage.setItem('tenantCreated', 'true');
      
      navigate('/verify');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
            Password *
          </label>
          <div style={{ position: 'relative' }}>
            <Lock style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: 'rgba(255, 255, 255, 0.4)'
            }} />
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              type="password"
              placeholder="Create a strong password"
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
          {errors.password && (
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#f87171' }}>
              {errors.password.message}
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
              <option value="free-trial" style={{ background: '#1a1a1a', color: 'white' }}>Free Trial (30 days)</option>
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

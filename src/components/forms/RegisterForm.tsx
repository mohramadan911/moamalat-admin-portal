import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
        <p className="mt-2 text-gray-600">Start your MOAMALAT journey today</p>
      </div>

      <form className="bg-white p-8 rounded-2xl shadow-lg border space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            {...register('companyName', { required: 'Company name is required' })}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your company name"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            {...register('adminName', { required: 'Full name is required' })}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
          {errors.adminName && (
            <p className="mt-1 text-sm text-red-600">{errors.adminName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            {...register('adminEmail', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email address"
          />
          {errors.adminEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.adminEmail.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Create a strong password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
            Select Plan *
          </label>
          <select
            {...register('plan', { required: 'Please select a plan' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose your plan</option>
            <option value="free-trial">Free Trial (30 days)</option>
            <option value="standard">Standard ($29/month)</option>
            <option value="enterprise">Enterprise ($99/month)</option>
          </select>
          {errors.plan && (
            <p className="mt-1 text-sm text-red-600">{errors.plan.message}</p>
          )}
        </div>

        <div className="flex items-start">
          <input
            {...register('acceptTerms', { required: 'You must accept the terms and conditions' })}
            type="checkbox"
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

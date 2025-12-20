import { Link } from 'react-router-dom';
import { Building2, Users, Shield, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <>
      <div className="header-shell">
        <div className="header">
          <h1 className="header-title">
            <Building2 className="w-8 h-8" />
            DataServe
          </h1>
          <div className="flex gap-4">
            <Link to="/login" className="button subtle">
              Sign In
            </Link>
            <Link to="/register" className="button">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="app-main">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-text">
            Welcome to DataServe
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Professional SaaS management platform for modern businesses. 
            Manage tenants, monitor usage, and scale with confidence.
          </p>
        </div>

        <div className="grid grid-cols-4 mb-12">
          <div className="bubble">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-semibold">Multi-Tenant</h3>
            </div>
            <p className="text-secondary">
              Isolated tenant environments with dedicated resources and security boundaries.
            </p>
          </div>

          <div className="bubble">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-semibold">User Management</h3>
            </div>
            <p className="text-secondary">
              Complete user lifecycle management with role-based access control.
            </p>
          </div>

          <div className="bubble">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-semibold">Enterprise Security</h3>
            </div>
            <p className="text-secondary">
              Advanced security features with encryption, audit logs, and compliance.
            </p>
          </div>

          <div className="bubble">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-yellow-400" />
              <h3 className="text-xl font-semibold">Real-time Analytics</h3>
            </div>
            <p className="text-secondary">
              Monitor usage, performance, and business metrics in real-time.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="bubble max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-secondary mb-6">
              Join thousands of businesses already using DataServe to manage their SaaS operations.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="button">
                Start Free Trial
              </Link>
              <Link to="/login" className="button subtle">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

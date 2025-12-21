import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import RegisterForm from '../components/forms/RegisterForm';

export default function Register() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Background */}
      <div className="bg-mesh" />
      
      {/* Floating orbs */}
      <div 
        className="floating-orb" 
        style={{
          width: '400px',
          height: '400px',
          background: 'rgba(139, 92, 246, 0.3)',
          top: '10%',
          left: '-10%',
          position: 'fixed'
        }}
      />
      <div 
        className="floating-orb" 
        style={{
          width: '300px',
          height: '300px',
          background: 'rgba(59, 130, 246, 0.2)',
          bottom: '10%',
          right: '-5%',
          position: 'fixed',
          animationDelay: '2s'
        }}
      />

      {/* Logo */}
      <Link 
        to="/" 
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          zIndex: 10
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Building2 style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <span className="logo-text">MOAMALAT</span>
      </Link>

      {/* Registration Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '2.5rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Join MOAMALAT
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Create your account and start managing your SaaS operations today
          </p>
        </div>

        <RegisterForm />
        
        <p style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          color: 'rgba(255, 255, 255, 0.5)' 
        }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: '500' }}
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { 
  Building2, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight, 
  Check
} from 'lucide-react';

export default function Landing() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#0a0a0f]">
      {/* Animated background - Fixed z-index */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 40%), radial-gradient(ellipse at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 40%)',
          zIndex: 0
        }}
      />
      
      {/* Floating orbs - Fixed positioning and z-index */}
      <div 
        className="fixed w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'rgba(139, 92, 246, 0.4)',
          top: '10%',
          left: '-10%',
          zIndex: 0,
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      <div 
        className="fixed w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'rgba(59, 130, 246, 0.4)',
          top: '30%',
          right: '-5%',
          zIndex: 0,
          animation: 'float 25s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />
      <div 
        className="fixed w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'rgba(236, 72, 153, 0.3)',
          bottom: '20%',
          left: '20%',
          zIndex: 0,
          animation: 'float 22s ease-in-out infinite',
          animationDelay: '4s'
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.05); }
          50% { transform: translate(-10px, 20px) scale(0.95); }
          75% { transform: translate(30px, 10px) scale(1.02); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .glass-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .btn-primary-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
        }
        
        .btn-secondary-custom:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Navbar - Fixed with proper backdrop */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(10, 10, 15, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div 
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo - Matching Login page style */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              }}
            >
              <Building2 style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <span 
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              MOAMALAT
            </span>
          </Link>
          
          {/* Navigation Links - Center */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}
          >
            <a 
              href="#features" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                textDecoration: 'none',
                fontSize: '0.9375rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#a78bfa'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                textDecoration: 'none',
                fontSize: '0.9375rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#a78bfa'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Pricing
            </a>
            <a 
              href="#about" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                textDecoration: 'none',
                fontSize: '0.9375rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#a78bfa'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              About
            </a>
          </div>

          {/* Buttons - Matching Login page style */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link 
              to="/login" 
              style={{
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'white',
                textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'white',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                border: 'none',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
              }}
            >
              <span>Get Started</span>
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Fixed padding and z-index */}
      <section 
        style={{
          position: 'relative',
          paddingTop: '180px',
          paddingBottom: '120px',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          zIndex: 1
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
            {/* Badge */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '2.5rem'
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 8px #4ade80'
              }} />
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Trusted by 500+ enterprises worldwide
              </span>
            </div>

            {/* Main heading */}
            <h1 style={{ marginBottom: '2rem' }}>
              <span 
                style={{
                  display: 'block',
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem'
                }}
              >
                Correspondence
              </span>
              <span 
                style={{
                  display: 'block',
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  fontWeight: '700',
                  lineHeight: '1.1',
                  background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Management Reimagined
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.8',
                maxWidth: '700px',
                margin: '0 auto 3rem auto'
              }}
            >
              MOAMALAT is the enterprise-grade platform for managing government correspondence, 
              documents, and workflows with complete security and compliance.
            </p>

            {/* CTA Buttons */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
                marginBottom: '4rem'
              }}
            >
              <Link 
                to="/register" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.0625rem',
                  fontWeight: '600',
                  color: 'white',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
                }}
              >
                <span>Start Free Trial</span>
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </Link>
              <button 
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.0625rem',
                  fontWeight: '600',
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                Watch Demo
              </button>
            </div>

            {/* Trust badges */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem'
              }}
            >
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.4)' }}>Powered by</span>
              <span style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '600' }}>DataServe</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '1.25rem' }}>|</span>
              <span style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.7)' }}>AWS Partner</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '1.25rem' }}>|</span>
              <span style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.7)' }}>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Fixed spacing and z-index */}
      <section 
        id="features" 
        className="relative px-6"
        style={{
          paddingTop: '100px',
          paddingBottom: '100px',
          zIndex: 1
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Everything you need
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Powerful features designed for enterprise-scale correspondence management
            </p>
          </div>

          <div 
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            {[
              {
                icon: Building2,
                title: 'Multi-Tenant',
                description: 'Isolated environments with dedicated resources and complete data separation.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Users,
                title: 'User Management',
                description: 'Complete lifecycle management with role-based access control.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Advanced encryption, audit logs, and compliance features.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Real-time Analytics',
                description: 'Monitor usage, performance, and metrics in real-time.',
                gradient: 'from-yellow-500 to-orange-500'
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-card animate-on-scroll"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '2rem',
                  transition: 'all 0.3s ease',
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <div 
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '1.5rem'
                  }}
                >
                  <feature.icon style={{ width: '28px', height: '28px', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: 'white' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="relative px-6"
        style={{
          paddingTop: '80px',
          paddingBottom: '80px',
          zIndex: 1
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div 
            className="animate-on-scroll"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '3rem',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              boxShadow: '0 0 60px rgba(139, 92, 246, 0.1)'
            }}
          >
            <div 
              className="grid gap-8 text-center"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
              }}
            >
              {[
                { number: '500+', label: 'Enterprise Clients' },
                { number: '2M+', label: 'Documents Processed' },
                { number: '99.9%', label: 'Uptime SLA' },
                { number: '24/7', label: 'Support Available' }
              ].map((stat) => (
                <div key={stat.label}>
                  <div 
                    style={{
                      fontSize: '3rem',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: '1.2'
                    }}
                  >
                    {stat.number}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Fixed spacing and badge positioning */}
      <section 
        id="pricing" 
        style={{
          position: 'relative',
          paddingTop: '100px',
          paddingBottom: '100px',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          zIndex: 1
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Section Header - with extra bottom margin for POPULAR badge */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '700',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Start free, scale as you grow
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              maxWidth: '1100px',
              margin: '0 auto'
            }}
          >
            {/* Free Tier */}
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '2.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>
                Free Trial
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem' }}>
                Perfect for evaluation
              </p>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '700', color: 'white' }}>$0</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', marginLeft: '4px' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {['Up to 100 documents', '5 users included', 'Basic support', '14-day trial'].map((item) => (
                  <li 
                    key={item} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      marginBottom: '1rem', 
                      color: 'rgba(255, 255, 255, 0.7)' 
                    }}
                  >
                    <Check style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/register" 
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  color: 'white',
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Tier - with POPULAR badge */}
            <div 
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '24px',
                padding: '2.5rem',
                paddingTop: '3rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.15)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(139, 92, 246, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(139, 92, 246, 0.15)';
              }}
            >
              {/* Popular badge - positioned at top of card */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '8px 24px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '1.5px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.5)',
                  whiteSpace: 'nowrap'
                }}
              >
                POPULAR
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>
                Professional
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem' }}>
                For growing teams
              </p>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '700', color: 'white' }}>$99</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', marginLeft: '4px' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {['Unlimited documents', 'Up to 50 users', 'Priority support', 'Advanced analytics', 'API access'].map((item) => (
                  <li 
                    key={item} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      marginBottom: '1rem', 
                      color: 'rgba(255, 255, 255, 0.7)' 
                    }}
                  >
                    <Check style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/register" 
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  color: 'white',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 30px rgba(99, 102, 241, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
                }}
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '2.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>
                Enterprise
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem' }}>
                For large organizations
              </p>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '700', color: 'white' }}>Custom</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {['Unlimited everything', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'On-premise option'].map((item) => (
                  <li 
                    key={item} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      marginBottom: '1rem', 
                      color: 'rgba(255, 255, 255, 0.7)' 
                    }}
                  >
                    <Check style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  color: '#a78bfa',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                }}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative px-6"
        style={{
          paddingTop: '80px',
          paddingBottom: '100px',
          zIndex: 1
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div 
            className="animate-on-scroll text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '24px',
              padding: '4rem 3rem'
            }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>
              Ready to transform your workflow?
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2.5rem', maxWidth: '32rem', margin: '0 auto 2.5rem' }}>
              Join hundreds of organizations already using MOAMALAT to streamline their correspondence management.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <Link 
                to="/register" 
                className="btn-primary-custom inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                  textDecoration: 'none'
                }}
              >
                <span>Start Free Trial</span>
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </Link>
              <Link 
                to="/login" 
                className="btn-secondary-custom px-8 py-4 rounded-xl font-semibold text-white transition-all"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textDecoration: 'none'
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="relative px-6 py-12"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          zIndex: 1
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                }}
              >
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                MOAMALAT by DataServe
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>

            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              © 2024 DataServe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
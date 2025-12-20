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
    <div className="min-h-screen relative">
      {/* Animated background */}
      <div className="bg-mesh" />
      
      {/* Floating orbs */}
      <div className="floating-orb w-96 h-96 bg-purple-500/30 top-20 -left-48" />
      <div className="floating-orb w-80 h-80 bg-blue-500/20 top-40 right-0" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-64 h-64 bg-pink-500/20 bottom-40 left-1/4" style={{ animationDelay: '4s' }} />

      {/* Navbar */}
      <nav className="navbar-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="logo-text">MOAMALAT</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</a>
              <a href="#about" className="text-white/70 hover:text-white transition-colors">About</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/70">Trusted by 500+ enterprises worldwide</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-up">
              <span className="text-gradient-hero">Correspondence</span>
              <br />
              <span className="text-gradient">Management Reimagined</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              MOAMALAT is the enterprise-grade platform for managing government correspondence, 
              documents, and workflows with complete security and compliance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 justify-center">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-50">
              <span className="text-sm text-white/50">Powered by</span>
              <span className="text-white/70 font-semibold">DataServe</span>
              <span className="text-white/30">|</span>
              <span className="text-white/70">AWS Partner</span>
              <span className="text-white/30">|</span>
              <span className="text-white/70">ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Everything you need
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Powerful features designed for enterprise-scale correspondence management
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              {
                icon: Building2,
                title: 'Multi-Tenant',
                description: 'Isolated environments with dedicated resources and complete data separation.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Users,
                title: 'User Management',
                description: 'Complete lifecycle management with role-based access control.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Advanced encryption, audit logs, and compliance features.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Real-time Analytics',
                description: 'Monitor usage, performance, and metrics in real-time.',
                color: 'from-yellow-500 to-orange-500'
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
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div 
                  className="feature-icon"
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
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div 
            className="glass-card-glow animate-on-scroll"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '3rem',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)'
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}>
              {[
                { number: '500+', label: 'Enterprise Clients' },
                { number: '2M+', label: 'Documents Processed' },
                { number: '99.9%', label: 'Uptime SLA' },
                { number: '24/7', label: 'Support Available' }
              ].map((stat) => (
                <div key={stat.label}>
                  <div 
                    className="stat-number"
                    style={{
                      fontSize: '3rem',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {stat.number}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-white/60">
              Start free, scale as you grow
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Free Tier */}
            <div 
              className="glass-card animate-on-scroll"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '2rem'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>Free Trial</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem' }}>Perfect for evaluation</p>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>$0</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {['Up to 100 documents', '5 users included', 'Basic support', '14-day trial'].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Check style={{ width: '20px', height: '20px', color: '#10b981' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link 
                to="/register" 
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '0.875rem 2rem',
                  background: 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Tier */}
            <div 
              className="glass-card pricing-card-featured animate-on-scroll"
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '20px',
                padding: '2rem',
                animationDelay: '0.1s'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '4px 16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '1px',
                borderRadius: '20px'
              }}>
                POPULAR
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>Professional</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem' }}>For growing teams</p>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>$99</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {['Unlimited documents', 'Up to 50 users', 'Priority support', 'Advanced analytics', 'API access'].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Check style={{ width: '20px', height: '20px', color: '#10b981' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link 
                to="/register" 
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  borderRadius: '12px',
                  border: 'none',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
                }}
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div 
              className="glass-card animate-on-scroll"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '2rem',
                animationDelay: '0.2s'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>Enterprise</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem' }}>For large organizations</p>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white' }}>Custom</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {['Unlimited everything', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'On-premise option'].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Check style={{ width: '20px', height: '20px', color: '#10b981' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                style={{
                  width: '100%',
                  padding: '0.875rem 2rem',
                  background: 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            className="glass-card cta-gradient animate-on-scroll"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '20px',
              padding: '3rem',
              textAlign: 'center'
            }}
          >
            <h2 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>
              Ready to transform your workflow?
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2rem', maxWidth: '32rem', margin: '0 auto 2rem' }}>
              Join hundreds of organizations already using MOAMALAT to streamline their correspondence management.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <Link 
                to="/register" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
                }}
              >
                <span>Start Free Trial</span>
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </Link>
              <Link 
                to="/login" 
                style={{
                  padding: '0.875rem 2rem',
                  background: 'transparent',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  borderRadius: '12px',
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
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white/80">MOAMALAT by DataServe</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>

            <p className="text-sm text-white/40">
              © 2024 DataServe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="glass-card p-8 animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`feature-icon mb-6 bg-gradient-to-br ${feature.color} bg-opacity-20`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card-glow p-12 animate-on-scroll">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '500+', label: 'Enterprise Clients' },
                { number: '2M+', label: 'Documents Processed' },
                { number: '99.9%', label: 'Uptime SLA' },
                { number: '24/7', label: 'Support Available' }
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="stat-number">{stat.number}</div>
                  <div className="text-white/50 mt-2">{stat.label}</div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="glass-card p-8 animate-on-scroll">
              <h3 className="text-xl font-semibold mb-2">Free Trial</h3>
              <p className="text-white/50 mb-6">Perfect for evaluation</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-white/50">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Up to 100 documents', '5 users included', 'Basic support', '14-day trial'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <Check className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-secondary w-full text-center block">
                Start Free Trial
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="glass-card pricing-card-featured p-8 animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <p className="text-white/50 mb-6">For growing teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-white/50">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited documents', 'Up to 50 users', 'Priority support', 'Advanced analytics', 'API access'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <Check className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary w-full text-center block">
                <span>Get Started</span>
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="glass-card p-8 animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-white/50 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited everything', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'On-premise option'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <Check className="w-5 h-5 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary w-full">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card cta-gradient p-12 text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your workflow?
            </h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Join hundreds of organizations already using MOAMALAT to streamline their correspondence management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 justify-center">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
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

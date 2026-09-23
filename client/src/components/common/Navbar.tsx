import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  Calendar, 
  CreditCard, 
  Receipt, 
  Menu, 
  X, 
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRegistration } from '../../context/RegistrationContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { profile } = useAuth();
  const { cartTotal, itemCount } = useRegistration();

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Events', path: '/events', icon: Layers },
    { name: 'Register', path: '/register', icon: Calendar, badge: itemCount > 0 ? `${itemCount}` : undefined },
    { name: 'Payment', path: '/payment', icon: CreditCard },
    { name: 'Receipt', path: '/invoice/latest', icon: Receipt },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-brand-border/60 backdrop-blur-xl transition-all">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo & College Identity */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-brand p-0.5 shadow-glow-indigo transition-transform group-hover:scale-105 shrink-0">
              <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-cyan text-base sm:text-xl">
                  ES
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold tracking-tight text-base sm:text-lg lg:text-xl text-white font-sans whitespace-nowrap">
                  ESEC <span className="text-gradient">FIESTA</span>
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold bg-brand-indigo/20 text-brand-cyan rounded-full border border-brand-indigo/40">
                  2026
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-brand-muted hidden sm:block tracking-wide truncate max-w-[200px] lg:max-w-none">
                Erode Sengunthar Engineering College
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 2xl:gap-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs xl:text-sm font-medium transition-all ${
                    active 
                      ? 'text-white bg-white/10 shadow-sm border border-white/10' 
                      : 'text-brand-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${active ? 'text-brand-cyan' : 'text-brand-muted'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-brand-indigo text-white text-[10px] font-bold rounded-full animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Participant UID & Register CTA */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3.5 shrink-0">
            {profile && (
              <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-xs">
                <UserCheck className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="text-brand-muted">UID:</span>
                <span className="font-mono font-bold text-white tracking-wider">
                  {profile.participantId}
                </span>
              </div>
            )}

            <Link
              to="/register"
              className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-brand hover:opacity-95 shadow-glow-indigo transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              <span>{itemCount > 0 ? `Checkout (₹${cartTotal})` : 'Register Now'}</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* Mobile Right Bar: Quick Cart & Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/register"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-indigo shrink-0"
            >
              ₹{cartTotal}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-muted hover:text-white hover:bg-brand-surface border border-brand-border"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-brand-border/80 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {profile && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-brand-surface border border-brand-border">
              <span className="text-xs text-brand-muted">Participant ID:</span>
              <span className="font-mono text-xs font-bold text-brand-cyan">{profile.participantId}</span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium ${
                    active ? 'bg-brand-indigo/20 text-white border border-brand-indigo/40' : 'text-brand-muted hover:text-white hover:bg-brand-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-brand-cyan' : 'text-brand-muted'}`} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 bg-brand-indigo text-white text-xs font-bold rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          <Link
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-brand shadow-glow-indigo"
          >
            <span>Proceed to Registration</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </header>
  );
};

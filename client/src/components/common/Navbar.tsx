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
  ChevronRight,
  LogIn,
  LogOut,
  Copy,
  Check,
  Shuffle,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRegistration } from '../../context/RegistrationContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  const location = useLocation();
  const { profile, openLoginModal, logout } = useAuth();
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

  const handleCopyUid = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (profile?.participantId) {
      navigator.clipboard.writeText(profile.participantId);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
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

          {/* Right Section: Participant UID Dropdown & Sign In / Register CTA */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3.5 shrink-0">
            {profile ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-border/90 text-xs transition-all group"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-brand flex items-center justify-center text-[11px] font-bold text-white uppercase">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-white text-[11px] max-w-[120px] truncate">
                      {profile.fullName}
                    </span>
                    <span className="font-mono text-[10px] text-brand-cyan">
                      {profile.participantId}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-muted group-hover:text-white transition-transform" />
                </button>

                {/* Profile Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 glass-panel rounded-2xl border border-brand-border/80 shadow-2xl p-3 bg-brand-surface/95 z-50 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 rounded-xl bg-brand-dark/80 border border-brand-border mb-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                          Active Participant
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUid}
                          className="flex items-center gap-1 text-[10px] text-brand-cyan hover:underline"
                        >
                          {copiedUid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUid ? 'Copied!' : 'Copy UID'}</span>
                        </button>
                      </div>
                      <p className="font-mono font-black text-sm text-white tracking-wider">
                        {profile.participantId}
                      </p>
                      <p className="text-xs font-semibold text-white mt-1">{profile.fullName}</p>
                      <p className="text-[11px] text-brand-muted truncate">{profile.college}</p>
                      <p className="text-[10px] text-brand-muted truncate">{profile.department} • {profile.yearOfStudy}</p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        to="/invoice/latest"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-white/5 transition-colors"
                      >
                        <Receipt className="w-4 h-4 text-brand-cyan" />
                        <span>My Event Receipt</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openLoginModal();
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-white/5 transition-colors"
                      >
                        <Shuffle className="w-4 h-4 text-brand-indigo" />
                        <span>Switch Participant / UID</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-cyan border border-brand-cyan/40 bg-brand-cyan/10 hover:bg-brand-cyan/20 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
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
            <button
              onClick={openLoginModal}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold text-brand-cyan bg-brand-surface border border-brand-border"
            >
              {profile ? profile.participantId.replace('EVT-2026-', '#') : 'Sign In'}
            </button>
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
          {profile ? (
            <div className="p-3 rounded-xl bg-brand-surface border border-brand-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-muted">Participant ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-cyan">{profile.participantId}</span>
                  <button onClick={handleCopyUid} className="text-brand-muted hover:text-white">
                    {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-border/60">
                <span className="text-white font-medium">{profile.fullName}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal();
                  }}
                  className="text-brand-cyan hover:underline text-[11px]"
                >
                  Switch UID
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLoginModal();
              }}
              className="w-full py-2.5 rounded-xl border border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan font-semibold text-xs flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with UID or Register</span>
            </button>
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

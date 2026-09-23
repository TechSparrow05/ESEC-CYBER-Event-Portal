import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Shuffle, 
  GraduationCap, 
  Mail, 
  Phone, 
  User 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeLoginModal, 
    loginWithUidOrEmail, 
    signUp, 
    allAccounts, 
    switchAccount,
    profile 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Sign In state
  const [identifier, setIdentifier] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Register state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('Erode Sengunthar Engineering College');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');
  const [registerError, setRegisterError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setLoginError('Please enter your Participant UID or Email.');
      return;
    }

    setLoginError('');
    setIsSubmitting(true);

    try {
      const userProfile = await loginWithUidOrEmail(identifier);
      setLoginSuccess(`Welcome back, ${userProfile.fullName}! (UID: ${userProfile.participantId})`);
      setTimeout(() => {
        setLoginSuccess(null);
        closeLoginModal();
      }, 1200);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials or register below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSwitch = (pid: string) => {
    switchAccount(pid);
    setLoginSuccess(`Switched to UID: ${pid}!`);
    setTimeout(() => {
      setLoginSuccess(null);
      closeLoginModal();
    }, 1000);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !college.trim()) {
      setRegisterError('Please fill in all mandatory fields.');
      return;
    }

    setRegisterError('');
    setIsSubmitting(true);

    try {
      const newProfile = await signUp({
        fullName,
        email,
        phone,
        college,
        department,
        yearOfStudy
      });

      setLoginSuccess(`Registration complete! Allocated UID: ${newProfile.participantId}`);
      setTimeout(() => {
        setLoginSuccess(null);
        closeLoginModal();
      }, 1500);
    } catch (err: any) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-xl glass-panel rounded-3xl border border-brand-border/80 shadow-2xl overflow-hidden bg-brand-surface/95 text-white my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accent Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-brand"></div>

        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-brand-muted hover:text-white hover:bg-white/10 transition-colors z-10"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand p-0.5 shadow-glow-indigo flex items-center justify-center">
              <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center text-brand-cyan">
                <KeyRound className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-white flex items-center gap-2">
                Participant Portal
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-indigo/30 text-brand-cyan border border-brand-indigo/40">
                  ESEC 2026
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted">
                Access your registrations, UID identity, and verified payment receipts
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 mt-5 bg-brand-dark/80 rounded-2xl border border-brand-border">
            <button
              onClick={() => { setActiveTab('login'); setLoginError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-brand-indigo text-white shadow-glow-indigo'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with UID</span>
            </button>
            <button
              onClick={() => { setActiveTab('register'); setRegisterError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-brand text-white shadow-glow-indigo'
                  : 'text-brand-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New User</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 pt-2 overflow-y-auto space-y-5">
          {/* Notification Messages */}
          {loginSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm animate-pulse">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="font-medium">{loginSuccess}</span>
            </div>
          )}

          {loginError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {registerError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{registerError}</span>
            </div>
          )}

          {/* TAB 1: LOGIN WITH UID / EMAIL */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                    Enter Participant UID or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. EVT-2026-1042 or student@college.edu"
                      className="w-full px-4 py-3.5 pl-11 rounded-xl bg-brand-dark/70 border border-brand-border focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan text-white text-sm font-mono placeholder:text-brand-muted/60 transition-all outline-none"
                    />
                    <Sparkles className="w-4 h-4 text-brand-cyan absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-brand-muted mt-1.5">
                    Tip: Enter your 4-digit code (e.g. <span className="font-mono text-brand-cyan">1042</span>) or your full UID.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-brand-indigo hover:bg-brand-indigoLight shadow-glow-indigo transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Sign In with UID</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Fast Switch Demo Accounts */}
              <div className="pt-4 border-t border-brand-border/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                    Quick Switch Participant Accounts:
                  </span>
                  <span className="text-[10px] font-mono text-brand-cyan flex items-center gap-1">
                    <Shuffle className="w-3 h-3" /> Shuffled Keys
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {allAccounts.slice(0, 4).map((acc) => {
                    const isCurrent = profile?.participantId === acc.participantId;
                    return (
                      <button
                        key={acc.participantId}
                        type="button"
                        onClick={() => handleQuickSwitch(acc.participantId)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 group ${
                          isCurrent
                            ? 'bg-brand-indigo/20 border-brand-indigo/50 shadow-sm'
                            : 'bg-brand-dark/50 border-brand-border hover:border-brand-border/90 hover:bg-white/5'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate group-hover:text-brand-cyan transition-colors">
                            {acc.fullName}
                          </p>
                          <p className="text-[11px] font-mono text-brand-cyan">
                            {acc.participantId}
                          </p>
                          <p className="text-[10px] text-brand-muted truncate">
                            {acc.department || acc.college}
                          </p>
                        </div>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-indigo text-[10px] font-bold text-white shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER NEW PARTICIPANT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-brand-indigo/15 to-brand-cyan/15 border border-brand-indigo/30 flex items-center gap-3">
                <Shuffle className="w-5 h-5 text-brand-cyan shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Dynamic UID Shuffling Enabled</p>
                  <p className="text-brand-muted">
                    Upon signup, you will be allocated a unique, non-sequential UID format <span className="font-mono text-brand-cyan font-bold">EVT-2026-XXXX</span>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Senthil Nathan"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-brand-dark/70 border border-brand-border focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan text-white text-sm outline-none"
                  />
                  <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@esec.ac.in"
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-brand-dark/70 border border-brand-border focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan text-white text-sm outline-none"
                    />
                    <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98421 12345"
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-brand-dark/70 border border-brand-border focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan text-white text-sm outline-none"
                    />
                    <Phone className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
                  College / Institution *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Erode Sengunthar Engineering College"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-brand-dark/70 border border-brand-border focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan text-white text-sm outline-none"
                  />
                  <GraduationCap className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Mechanical Engineering"
                    className="w-full px-4 py-3 rounded-xl bg-brand-dark/70 border border-brand-border focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
                    Year of Study
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-dark/70 border border-brand-border focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan text-white text-sm outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-brand shadow-glow-indigo transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Shuffled UID & Register</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

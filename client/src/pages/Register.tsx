import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Crown, 
  UserPlus, 
  User, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRegistration } from '../context/RegistrationContext';
import { ConstraintBanner } from '../components/events/ConstraintBanner';
import { EventCard } from '../components/events/EventCard';
import { Badge } from '../components/common/Badge';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, openLoginModal } = useAuth();
  const { 
    roleType, 
    setRoleType, 
    selectedTechnicalEvent, 
    selectedNonTechnicalEvent, 
    allEvents,
    cartTotal,
    itemCount,
    teamCode,
    setTeamCode,
    teamName,
    setTeamName,
    verifiedTeam,
    isVerifyingTeam,
    verifyTeamCode
  } = useRegistration();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || 'Aravind Krishnan',
    email: profile?.email || 'aravind.k@esec.ac.in',
    phone: profile?.phone || '9842154321',
    college: profile?.college || 'Erode Sengunthar Engineering College',
    department: profile?.department || 'Computer Science & Engineering',
    yearOfStudy: profile?.yearOfStudy || '3rd Year'
  });

  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [teamCodeError, setTeamCodeError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto-generate a team code if role is Leader and none generated yet
  const [generatedLeaderCode] = useState(() => 'ESEC-' + Math.random().toString(36).substring(2, 6).toUpperCase());

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyJoinCode = async () => {
    setTeamCodeError(null);
    if (!joinCodeInput.trim()) {
      setTeamCodeError('Please enter a team code');
      return;
    }
    const success = await verifyTeamCode(joinCodeInput);
    if (success) {
      setTeamCode(joinCodeInput.toUpperCase());
    } else {
      setTeamCodeError('Invalid or expired team code. Please check with your team leader.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      // Validate profile and role
      if (!formData.fullName || !formData.email || !formData.college) {
        alert('Please fill in all participant personal details.');
        return;
      }
      if (roleType === 'Member' && !teamCode) {
        alert('As a Team Member, you must enter and verify a Team Join Code.');
        return;
      }
      if (roleType === 'Leader' && !teamName.trim()) {
        setTeamName('Team Alpha ' + formData.fullName.split(' ')[0]);
      }
      updateProfile(formData);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (itemCount === 0) {
        alert('Please select at least 1 Technical or Non-Technical event.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleProceedToPayment = () => {
    // Navigate to payment page with state
    navigate('/payment');
  };

  return (
    <div className="w-full min-h-screen py-8 sm:py-14 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1500px] mx-auto space-y-8 flex-1 flex flex-col justify-center">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="cyan" size="sm" className="mb-2">SYMPOSIUM ONBOARDING</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Event Registration Wizard</h1>
        <p className="text-xs sm:text-base text-brand-muted mt-1.5">
          Follow the 3 steps to configure your role, select constraint-compliant events, and finalize entry.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-brand-border/70 w-full">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all ${
              currentStep >= 1 ? 'bg-brand-indigo text-white shadow-glow-indigo' : 'bg-brand-surface text-brand-muted border border-brand-border'
            }`}>
              1
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white">Role & Profile</p>
              <p className="text-[10px] text-brand-muted">Participant UID</p>
            </div>
          </div>

          <div className={`h-0.5 flex-1 mx-4 transition-colors ${currentStep >= 2 ? 'bg-brand-indigo' : 'bg-brand-border'}`} />

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all ${
              currentStep >= 2 ? 'bg-brand-indigo text-white shadow-glow-indigo' : 'bg-brand-surface text-brand-muted border border-brand-border'
            }`}>
              2
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white">Event Selection</p>
              <p className="text-[10px] text-brand-muted">Hard Rules Applied</p>
            </div>
          </div>

          <div className={`h-0.5 flex-1 mx-4 transition-colors ${currentStep === 3 ? 'bg-brand-indigo' : 'bg-brand-border'}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all ${
              currentStep === 3 ? 'bg-brand-cyan text-brand-dark shadow-glow-cyan' : 'bg-brand-surface text-brand-muted border border-brand-border'
            }`}>
              3
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white">Review & Checkout</p>
              <p className="text-[10px] text-brand-muted">Fee Breakdown</p>
            </div>
          </div>

        </div>
      </div>

      {/* STEP 1: PARTICIPANT PROFILE & ROLE SELECTION */}
      {currentStep === 1 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-brand-border/80 space-y-8 animate-fadeIn">
          
          {/* Participant UID Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-indigo/15 via-brand-surface to-brand-cyan/15 border border-brand-indigo/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-indigo/20 text-brand-cyan">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-brand-muted">Unique Shuffled Participant UID</p>
                <p className="text-lg font-mono font-black text-white tracking-widest">
                  {profile?.participantId || 'EVT-2026-XXXX'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={openLoginModal}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-brand-border text-brand-cyan font-medium transition-all"
              >
                Switch UID / Login
              </button>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Primary Key
              </span>
            </div>
          </div>

          {/* Role Type Selection: Leader vs Member vs Solo */}
          <div>
            <label className="block text-sm font-bold text-white mb-3">
              Select Your Participation Mode:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Leader Option */}
              <button
                type="button"
                onClick={() => setRoleType('Leader')}
                className={`p-5 rounded-2xl border text-left transition-all relative ${
                  roleType === 'Leader'
                    ? 'border-brand-indigo bg-brand-indigo/15 ring-1 ring-brand-indigo shadow-glow-indigo'
                    : 'border-brand-border bg-brand-surface/60 hover:bg-brand-surface hover:border-brand-border/90'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
                    <Crown className="w-5 h-5" />
                  </div>
                  {roleType === 'Leader' && <CheckCircle2 className="w-5 h-5 text-brand-cyan" />}
                </div>
                <h4 className="text-sm font-bold text-white">Team Leader</h4>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Creates the squad, generates a 6-character Join Code, and coordinates payment.
                </p>
              </button>

              {/* Member Option */}
              <button
                type="button"
                onClick={() => setRoleType('Member')}
                className={`p-5 rounded-2xl border text-left transition-all relative ${
                  roleType === 'Member'
                    ? 'border-brand-cyan bg-brand-cyan/15 ring-1 ring-brand-cyan shadow-glow-cyan'
                    : 'border-brand-border bg-brand-surface/60 hover:bg-brand-surface hover:border-brand-border/90'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-brand-cyan/15 text-brand-cyan">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  {roleType === 'Member' && <CheckCircle2 className="w-5 h-5 text-brand-cyan" />}
                </div>
                <h4 className="text-sm font-bold text-white">Team Member</h4>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Joining an existing squad. Enter the code provided by your Leader.
                </p>
              </button>

              {/* Solo Option */}
              <button
                type="button"
                onClick={() => setRoleType('Solo')}
                className={`p-5 rounded-2xl border text-left transition-all relative ${
                  roleType === 'Solo'
                    ? 'border-brand-indigo bg-brand-indigo/15 ring-1 ring-brand-indigo shadow-glow-indigo'
                    : 'border-brand-border bg-brand-surface/60 hover:bg-brand-surface hover:border-brand-border/90'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-brand-indigo/15 text-brand-indigoLight">
                    <User className="w-5 h-5" />
                  </div>
                  {roleType === 'Solo' && <CheckCircle2 className="w-5 h-5 text-brand-cyan" />}
                </div>
                <h4 className="text-sm font-bold text-white">Individual Solo</h4>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Solo competitor for algorithmic coding, photography, or solo paper tracks.
                </p>
              </button>

            </div>
          </div>

          {/* Conditional: Leader Team Creation Input */}
          {roleType === 'Leader' && (
            <div className="p-5 rounded-2xl bg-brand-surface border border-brand-indigo/30 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Leader Squad Setup</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-brand-muted mb-1 font-semibold">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="e.g. Silicon Crusaders"
                    className="w-full px-4 py-2 bg-brand-dark rounded-xl border border-brand-border text-xs text-white focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-muted mb-1 font-semibold">Generated Team Join Code</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLeaderCode}
                      className="w-full px-4 py-2 bg-brand-dark rounded-xl border border-brand-indigo/50 font-mono font-bold text-brand-cyan text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyCode(generatedLeaderCode)}
                      className="px-3 py-2 bg-brand-indigo/20 hover:bg-brand-indigo/40 rounded-xl text-brand-cyan text-xs flex items-center gap-1 shrink-0"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-brand-muted mt-1">Share this code with your team members to join your squad.</p>
                </div>
              </div>
            </div>
          )}

          {/* Conditional: Member Join Code Input */}
          {roleType === 'Member' && (
            <div className="p-5 rounded-2xl bg-brand-surface border border-brand-cyan/30 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-brand-cyan" />
                <span>Join Existing Squad</span>
              </h4>
              <div className="max-w-md">
                <label className="block text-xs text-brand-muted mb-1 font-semibold">
                  Enter 6-Character Team Code (provided by your Leader)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. ESEC-7X2 or TEAM01"
                    maxLength={10}
                    className="w-full px-4 py-2 bg-brand-dark rounded-xl border border-brand-border uppercase font-mono font-bold text-xs text-white focus:outline-none focus:border-brand-cyan"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyJoinCode}
                    disabled={isVerifyingTeam}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-cyan hover:opacity-90 text-brand-dark shrink-0 transition-all"
                  >
                    {isVerifyingTeam ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>

                {teamCodeError && (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{teamCodeError}</span>
                  </p>
                )}

                {verifiedTeam && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verified Squad: <strong>{verifiedTeam.teamName}</strong> (Code: {verifiedTeam.teamCode})</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Participant Details Form */}
          <div className="space-y-4 pt-4 border-t border-brand-border/60">
            <h4 className="text-sm font-bold text-white">Participant Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-brand-muted mb-1 font-semibold">Full Legal Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:border-brand-indigo focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-brand-muted mb-1 font-semibold">Email Address (for Receipt) *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:border-brand-indigo focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-brand-muted mb-1 font-semibold">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:border-brand-indigo focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-brand-muted mb-1 font-semibold">College / Institution Name *</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:border-brand-indigo focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-brand-muted mb-1 font-semibold">Department / Branch</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:border-brand-indigo focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-muted mb-1 font-semibold">Year of Study</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border text-xs text-white focus:border-brand-indigo focus:outline-none"
                >
                  <option value="1st Year">1st Year B.E / B.Tech</option>
                  <option value="2nd Year">2nd Year B.E / B.Tech</option>
                  <option value="3rd Year">3rd Year B.E / B.Tech</option>
                  <option value="Final Year">Final Year B.E / B.Tech</option>
                  <option value="Postgraduate">M.E / M.Tech / MBA / MCA</option>
                </select>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={goToNextStep}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-105 active:scale-95 transition-all"
            >
              <span>Continue to Event Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: EVENT SELECTION & HARD RULES */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          
          <ConstraintBanner />

          {/* Section: Technical Events */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="technical">Technical Track</Badge>
                <span className="text-xs text-brand-muted font-mono">(Max 1 Event)</span>
              </div>
              {selectedTechnicalEvent && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Slot Filled: {selectedTechnicalEvent.title}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allEvents.filter(e => e.category === 'Technical').map(evt => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>

          {/* Section: Non-Technical Events */}
          <div className="space-y-4 pt-6 border-t border-brand-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="nonTechnical">Non-Technical Track</Badge>
                <span className="text-xs text-brand-muted font-mono">(Max 1 Event)</span>
              </div>
              {selectedNonTechnicalEvent && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Slot Filled: {selectedNonTechnicalEvent.title}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allEvents.filter(e => e.category === 'Non-Technical').map(evt => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>

          {/* Step Navigation Bar */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-brand-muted hover:text-white bg-brand-surface border border-brand-border transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] text-brand-muted font-mono">{itemCount} of 2 Events Selected</p>
                <p className="text-base font-mono font-bold text-white">Total: <span className="text-brand-cyan">₹{cartTotal}</span></p>
              </div>

              <button
                type="button"
                onClick={goToNextStep}
                disabled={itemCount === 0}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                <span>Review Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: REVIEW & ORDER SUMMARY */}
      {currentStep === 3 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-brand-border/80 space-y-8 animate-fadeIn">
          
          <div>
            <Badge variant="cyan" size="sm" className="mb-2">ORDER VERIFICATION</Badge>
            <h2 className="text-2xl font-bold text-white">Review Registration Summary</h2>
            <p className="text-xs text-brand-muted mt-1">
              Confirm your participant details, chosen events, and fees before proceeding to UPI settlement.
            </p>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Participant Profile Card */}
            <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border/70 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-brand-indigoLight">
                Participant Details
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-brand-border/40">
                  <span className="text-brand-muted">Participant UID:</span>
                  <span className="font-mono font-bold text-brand-cyan">{profile?.participantId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-border/40">
                  <span className="text-brand-muted">Full Name:</span>
                  <span className="font-semibold text-white">{formData.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-border/40">
                  <span className="text-brand-muted">Email:</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-border/40">
                  <span className="text-brand-muted">Phone:</span>
                  <span className="text-white">{formData.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-border/40">
                  <span className="text-brand-muted">College:</span>
                  <span className="text-white text-right max-w-[200px] truncate">{formData.college}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-brand-muted">Role:</span>
                  <span className="font-semibold text-white">
                    {roleType} {roleType === 'Leader' && `(Code: ${generatedLeaderCode})`} {roleType === 'Member' && `(Team: ${teamCode})`}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Events Breakdown */}
            <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border/70 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-brand-cyan">
                  Event Entries & Category Validation
                </h3>
                
                <div className="space-y-3 mt-3">
                  {selectedTechnicalEvent && (
                    <div className="p-3 rounded-xl bg-black/40 border border-brand-indigo/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo" />
                          <span className="font-bold text-white">{selectedTechnicalEvent.title}</span>
                        </div>
                        <p className="text-[10px] text-brand-muted ml-3">Technical Track • {selectedTechnicalEvent.venue}</p>
                      </div>
                      <span className="font-mono font-bold text-white">₹{selectedTechnicalEvent.fee}</span>
                    </div>
                  )}

                  {selectedNonTechnicalEvent && (
                    <div className="p-3 rounded-xl bg-black/40 border border-brand-cyan/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                          <span className="font-bold text-white">{selectedNonTechnicalEvent.title}</span>
                        </div>
                        <p className="text-[10px] text-brand-muted ml-3">Non-Technical Track • {selectedNonTechnicalEvent.venue}</p>
                      </div>
                      <span className="font-mono font-bold text-white">₹{selectedNonTechnicalEvent.fee}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="pt-4 border-t border-brand-border/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Portal Processing & GST:</span>
                  <span className="text-emerald-400 font-mono">₹0 (Free)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-brand-border/40">
                  <span>Grand Total Payable:</span>
                  <span className="font-mono text-brand-cyan text-base">₹{cartTotal}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-brand-muted hover:text-white bg-brand-surface border border-brand-border transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Events</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToPayment}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-105 active:scale-95 transition-all"
            >
              <span>Proceed to UPI Settlement (₹{cartTotal})</span>
              <CreditCard className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

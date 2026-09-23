import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Code, 
  Gamepad2, 
  Calendar, 
  Trophy, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { DEFAULT_EVENTS } from '../data/events';
import { Badge } from '../components/common/Badge';

export const Home: React.FC = () => {
  const [activeDayTab, setActiveDayTab] = useState<'morning' | 'afternoon'>('morning');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const technicalEvents = DEFAULT_EVENTS.filter(e => e.category === 'Technical');
  const nonTechnicalEvents = DEFAULT_EVENTS.filter(e => e.category === 'Non-Technical');

  const faqs = [
    {
      q: 'What is the category selection hard rule?',
      a: 'Each registered participant can choose at most ONE Technical event and at most ONE Non-Technical event. Duplicate entries within the same category will be strictly blocked by the portal validation.'
    },
    {
      q: 'How does Team Registration work for Leaders and Members?',
      a: 'If you are participating in a team event (like Web Dev Clash or BGMI), one member registers as the "Leader", creating a unique 6-character Team Code. Other team members register under "Team Member" and enter this code to link themselves.'
    },
    {
      q: 'How do I pay and verify my registration?',
      a: 'On checkout, scan the dynamic UPI QR code or send payment to the college VPA (esecfest2026@okaxis). Enter the 12-digit UPI Transaction Ref ID (UTR) and upload your payment screenshot. Our backend validates the unique UTR and stores the receipt image in Google Cloud Storage.'
    },
    {
      q: 'Will participants receive food and certificates?',
      a: 'Yes! All registered participants receive a customized delegate kit, welcome breakfast, delicious buffet lunch, evening high-tea, and an official Participation Certificate recognized by AICTE.'
    }
  ];

  return (
    <div className="relative min-h-screen">
      
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-brand-indigo/20 rounded-full blur-[128px] animate-pulse-subtle" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-brand-cyan/15 rounded-full blur-[128px] animate-pulse-subtle" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand-indigo/40 shadow-glow-indigo text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="text-brand-muted">October 15, 2026 • Erode, Tamil Nadu</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
            <span className="text-brand-cyan font-semibold">Registrations Live</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.1]">
            Unleash Intellect & Creativity at <br />
            <span className="text-gradient">ESEC FIESTA 2026</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-brand-muted max-w-2xl mx-auto font-sans leading-relaxed">
            The premier national-level technical & cultural symposium hosted by Erode Sengunthar Engineering College. Compete with the sharpest minds across India for glory and cash prizes.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-105 active:scale-95 transition-all"
            >
              <span>Start Registration</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/events"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-brand-surface hover:bg-brand-card border border-brand-border hover:border-brand-indigo/50 transition-all"
            >
              <span>Explore 8 Competitions</span>
            </Link>
          </div>

          {/* Key Rule Pill */}
          <div className="pt-2">
            <p className="text-xs font-mono text-brand-muted/80 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-surface/40 border border-brand-border/40">
              <span className="text-brand-cyan font-bold">Rule Constraint:</span> Max 1 Technical + Max 1 Non-Technical per UID
            </p>
          </div>

          {/* Stat Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
            {[
              { label: 'Total Cash Prize', value: '₹75,000+', icon: Trophy, color: 'text-amber-400' },
              { label: 'Event Tracks', value: 'Technical & Cultural', icon: Zap, color: 'text-brand-cyan' },
              { label: 'Expected Footfall', value: '1,500+ Peers', icon: Users, color: 'text-brand-indigoLight' },
              { label: 'Certification', value: 'AICTE & IEEE Recognized', icon: ShieldCheck, color: 'text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-5 rounded-2xl border border-brand-border/70 hover:border-brand-border transition-all">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <div className="text-2xl font-black text-white font-mono">{stat.value}</div>
                <div className="text-xs text-brand-muted font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. CATEGORY PREVIEW: TECHNICAL VS NON-TECHNICAL */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-border/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <Badge variant="indigo" size="sm" className="mb-2">TWO DISTINCT TRACKS</Badge>
            <h2 className="text-3xl font-extrabold text-white">Event Categories Preview</h2>
            <p className="text-sm text-brand-muted mt-1 max-w-xl">
              Participants can enroll in one event per track. Balance deep technical challenges with spontaneous cultural showdowns.
            </p>
          </div>
          <Link to="/events" className="flex items-center gap-1.5 text-sm font-semibold text-brand-cyan hover:underline">
            <span>View Full Details & Rules</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Technical Track Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-brand-indigo/30 bg-gradient-to-br from-brand-indigo/10 via-brand-surface to-brand-surface">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-indigo/20 border border-brand-indigo/40 text-brand-indigoLight">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Technical Track</h3>
                  <p className="text-xs text-brand-muted">Engineering, coding, research and logic</p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-indigo/20 text-brand-indigoLight border border-brand-indigo/30">
                Pick Max 1
              </span>
            </div>

            <div className="space-y-3">
              {technicalEvents.map(evt => (
                <div key={evt.id} className="p-4 rounded-xl bg-black/40 border border-brand-border/60 hover:border-brand-indigo/50 transition-all flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{evt.title}</h4>
                    <p className="text-xs text-brand-muted mt-0.5">{evt.venue} • {evt.scheduleTime}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-brand-indigoLight">₹{evt.fee}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between">
              <span className="text-xs text-brand-muted">4 Competitive Arenas</span>
              <Link to="/register" className="text-xs font-bold text-white hover:text-brand-cyan flex items-center gap-1">
                Select Technical Event <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Non-Technical Track Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 via-brand-surface to-brand-surface">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Non-Technical Track</h3>
                  <p className="text-xs text-brand-muted">Esports, arts, mystery hunts and marketing</p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                Pick Max 1
              </span>
            </div>

            <div className="space-y-3">
              {nonTechnicalEvents.map(evt => (
                <div key={evt.id} className="p-4 rounded-xl bg-black/40 border border-brand-border/60 hover:border-brand-cyan/50 transition-all flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{evt.title}</h4>
                    <p className="text-xs text-brand-muted mt-0.5">{evt.venue} • {evt.scheduleTime}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-brand-cyan">₹{evt.fee}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between">
              <span className="text-xs text-brand-muted">4 Engaging Arenas</span>
              <Link to="/register" className="text-xs font-bold text-white hover:text-brand-cyan flex items-center gap-1">
                Select Non-Technical Event <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE SCHEDULE TIMELINE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-border/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="cyan" size="sm" className="mb-2">SYMPOSIUM TIMELINE</Badge>
          <h2 className="text-3xl font-extrabold text-white">Interactive Festival Schedule</h2>
          <p className="text-sm text-brand-muted mt-1">
            Carefully curated to prevent timing clashes between Technical and Non-Technical rounds.
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setActiveDayTab('morning')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeDayTab === 'morning'
                  ? 'bg-brand-indigo text-white shadow-glow-indigo'
                  : 'bg-brand-surface text-brand-muted hover:text-white border border-brand-border'
              }`}
            >
              Morning Track (09:00 AM - 01:00 PM)
            </button>
            <button
              onClick={() => setActiveDayTab('afternoon')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeDayTab === 'afternoon'
                  ? 'bg-brand-cyan text-brand-dark font-bold shadow-glow-cyan'
                  : 'bg-brand-surface text-brand-muted hover:text-white border border-brand-border'
              }`}
            >
              Afternoon Track (01:00 PM - 05:30 PM)
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {activeDayTab === 'morning' ? (
            <>
              <div className="p-5 rounded-2xl glass-panel border border-brand-border flex items-start gap-4">
                <div className="font-mono text-sm font-bold text-brand-cyan bg-brand-cyan/10 px-3 py-1.5 rounded-lg shrink-0">
                  09:00 AM
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Inaugural Ceremony & Keynote Address</h4>
                  <p className="text-xs text-brand-muted mt-1">Main College Auditorium with Distinguished Industry Dignitaries from Tech Giants.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-brand-indigo/40 flex items-start gap-4">
                <div className="font-mono text-sm font-bold text-brand-indigoLight bg-brand-indigo/10 px-3 py-1.5 rounded-lg shrink-0">
                  10:00 AM
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Algorithmic Code Sprint & LensCraft Photography Commences</span>
                    <Badge variant="technical" size="sm">Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Lab 3 (Turing Hall) & Open Amphitheatre Campus Grounds.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-brand-indigo/40 flex items-start gap-4">
                <div className="font-mono text-sm font-bold text-brand-indigoLight bg-brand-indigo/10 px-3 py-1.5 rounded-lg shrink-0">
                  11:30 AM
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Full-Stack Web Dev Clash - Live Prompt Reveal</span>
                    <Badge variant="technical" size="sm">Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Incubation Center (Silicon Lab) - 4 Hour Sprint.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-brand-border flex items-start gap-4">
                <div className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg shrink-0">
                  01:00 PM
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Grand Buffet Lunch & Networking Session</h4>
                  <p className="text-xs text-brand-muted mt-1">College Central Dining Quadrangle (Complimentary for all participants).</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-5 rounded-2xl glass-panel border border-brand-cyan/40 flex items-start gap-4">
                <div className="font-mono text-sm font-bold text-brand-cyan bg-brand-cyan/10 px-3 py-1.5 rounded-lg shrink-0">
                  01:30 PM
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>BGMI Esports Showdown - Custom Lobby Finals</span>
                    <Badge variant="nonTechnical" size="sm">Non-Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Student Activity Center (SAC 2) - Streamed Live to Big Screens.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-brand-indigo/40 flex items-start gap-4">
                <div className="font-mono text-sm font-bold text-brand-indigoLight bg-brand-indigo/10 px-3 py-1.5 rounded-lg shrink-0">
                  02:00 PM
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>National Paper Presentation Sessions</span>
                    <Badge variant="technical" size="sm">Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Auditorium Seminar Hall A & B (Judged by IEEE Chairpersons).</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-brand-cyan/40 flex items-start gap-4">
                <div className="font-mono text-sm font-bold text-brand-cyan bg-brand-cyan/10 px-3 py-1.5 rounded-lg shrink-0">
                  02:30 PM
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>The Da Vinci Code - Cryptic Treasure Hunt</span>
                    <Badge variant="nonTechnical" size="sm">Non-Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Campus-wide Checkpoints & Library Quadrangle.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-brand-border flex items-start gap-4">
                <div className="font-mono text-sm font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg shrink-0">
                  04:30 PM
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Valedictory Ceremony & Cash Prize Distribution</h4>
                  <p className="text-xs text-brand-muted mt-1">Trophy Handover, IEEE Certificate distribution, and Celebrity Musical Evening.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-brand-border/40">
        <div className="text-center mb-10">
          <Badge variant="neutral" size="sm" className="mb-2">NEED HELP?</Badge>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl border border-brand-border/80 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-brand-cyan transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-brand-muted transition-transform ${openFaq === idx ? 'rotate-180 text-brand-cyan' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-brand-muted leading-relaxed border-t border-brand-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-brand-indigo/40 text-center relative overflow-hidden bg-gradient-to-r from-brand-indigo/20 via-brand-dark to-brand-cyan/20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Prove Your Skills at ESEC Fiesta 2026?
          </h2>
          <p className="text-sm sm:text-base text-brand-muted max-w-2xl mx-auto mb-8">
            Slots are limited per college department. Secure your Technical and Non-Technical event passes now.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-105 active:scale-95 transition-all"
          >
            <span>Complete Registration Form</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};

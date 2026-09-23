import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Code, 
  Gamepad2, 
  Trophy, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
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
    <div className="relative min-h-screen flex flex-col w-full overflow-x-hidden">
      
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-brand-indigo/20 rounded-full blur-[100px] sm:blur-[140px] animate-pulse-subtle" />
        <div className="absolute top-28 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-brand-cyan/15 rounded-full blur-[100px] sm:blur-[140px] animate-pulse-subtle" />
      </div>

      {/* 1. HERO SECTION: Screen-adaptive flex layout */}
      <section className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 md:py-14 max-w-7xl mx-auto">
        <div className="w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 my-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full glass-panel border border-brand-indigo/40 shadow-glow-indigo text-[11px] sm:text-xs font-mono max-w-full truncate">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
            <span className="text-brand-muted truncate">October 15, 2026 • Erode, TN</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
            <span className="text-brand-cyan font-semibold shrink-0">Registrations Live</span>
          </div>

          {/* Main Headline with fluid typography */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.15] max-w-5xl">
            Unleash Intellect & <br className="hidden sm:inline" />
            Creativity at <br className="inline sm:hidden" />
            <span className="text-gradient">ESEC FIESTA 2026</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-brand-muted max-w-2xl mx-auto font-sans leading-relaxed px-2">
            The premier national-level technical & cultural symposium hosted by Erode Sengunthar Engineering College. Compete with the sharpest minds across India for glory and cash prizes.
          </p>

          {/* Call to Actions - responsive flex */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto px-4">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-105 active:scale-95 transition-all"
            >
              <span>Start Registration</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            <Link
              to="/events"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold text-white bg-brand-surface hover:bg-brand-card border border-brand-border hover:border-brand-indigo/50 transition-all"
            >
              <span>Explore 8 Competitions</span>
            </Link>
          </div>

          {/* Key Rule Pill */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-surface/60 border border-brand-border/60 text-[11px] sm:text-xs font-mono text-brand-muted">
              <span className="text-brand-cyan font-bold">Rule Constraint:</span>
              <span>Max 1 Technical + Max 1 Non-Technical per UID</span>
            </div>
          </div>

          {/* Stat Metric Cards - adaptive responsive grid */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-8 text-left max-w-5xl">
            {[
              { label: 'Total Cash Prize', value: '₹75,000+', icon: Trophy, color: 'text-amber-400' },
              { label: 'Event Tracks', value: 'Tech & Cultural', icon: Zap, color: 'text-brand-cyan' },
              { label: 'Expected Footfall', value: '1,500+ Peers', icon: Users, color: 'text-brand-indigoLight' },
              { label: 'Certification', value: 'AICTE Recognized', icon: ShieldCheck, color: 'text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-4 sm:p-5 rounded-2xl border border-brand-border/70 hover:border-brand-indigo/40 transition-all flex flex-col justify-between">
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} mb-2.5`} />
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">{stat.value}</div>
                  <div className="text-[11px] sm:text-xs text-brand-muted font-medium mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. CATEGORY PREVIEW: TECHNICAL VS NON-TECHNICAL */}
      <section className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-border/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="indigo" size="sm" className="mb-2">TWO DISTINCT TRACKS</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Event Categories Preview</h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
              Participants can enroll in one event per track. Balance deep technical challenges with spontaneous cultural showdowns.
            </p>
          </div>
          <Link to="/events" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-cyan hover:underline shrink-0">
            <span>View Full Details & Rules</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Technical Track Card */}
          <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-brand-indigo/30 bg-gradient-to-br from-brand-indigo/10 via-brand-surface to-brand-surface flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-brand-indigo/20 border border-brand-indigo/40 text-brand-indigoLight">
                    <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Technical Track</h3>
                    <p className="text-xs text-brand-muted">Engineering, coding, research and logic</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-brand-indigo/20 text-brand-indigoLight border border-brand-indigo/30">
                  Pick Max 1
                </span>
              </div>

              <div className="space-y-2.5">
                {technicalEvents.map(evt => (
                  <div key={evt.id} className="p-3.5 rounded-xl bg-black/40 border border-brand-border/60 hover:border-brand-indigo/50 transition-all flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{evt.title}</h4>
                      <p className="text-[11px] text-brand-muted mt-0.5 truncate">{evt.venue} • {evt.scheduleTime}</p>
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-brand-indigoLight shrink-0">₹{evt.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border/40 flex items-center justify-between">
              <span className="text-xs text-brand-muted">4 Competitive Arenas</span>
              <Link to="/register" className="text-xs font-bold text-white hover:text-brand-cyan flex items-center gap-1">
                Select Technical Event <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Non-Technical Track Card */}
          <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 via-brand-surface to-brand-surface flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan">
                    <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Non-Technical Track</h3>
                    <p className="text-xs text-brand-muted">Esports, arts, mystery hunts and marketing</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                  Pick Max 1
                </span>
              </div>

              <div className="space-y-2.5">
                {nonTechnicalEvents.map(evt => (
                  <div key={evt.id} className="p-3.5 rounded-xl bg-black/40 border border-brand-border/60 hover:border-brand-cyan/50 transition-all flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{evt.title}</h4>
                      <p className="text-[11px] text-brand-muted mt-0.5 truncate">{evt.venue} • {evt.scheduleTime}</p>
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-brand-cyan shrink-0">₹{evt.fee}</span>
                  </div>
                ))}
              </div>
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
      <section className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-brand-border/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="cyan" size="sm" className="mb-2">SYMPOSIUM TIMELINE</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Interactive Festival Schedule</h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 px-2">
            Carefully curated to prevent timing clashes between Technical and Non-Technical rounds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
            <button
              onClick={() => setActiveDayTab('morning')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeDayTab === 'morning'
                  ? 'bg-brand-indigo text-white shadow-glow-indigo'
                  : 'bg-brand-surface text-brand-muted hover:text-white border border-brand-border'
              }`}
            >
              Morning Track (09:00 AM - 01:00 PM)
            </button>
            <button
              onClick={() => setActiveDayTab('afternoon')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeDayTab === 'afternoon'
                  ? 'bg-brand-cyan text-brand-dark font-bold shadow-glow-cyan'
                  : 'bg-brand-surface text-brand-muted hover:text-white border border-brand-border'
              }`}
            >
              Afternoon Track (01:00 PM - 05:30 PM)
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-3.5">
          {activeDayTab === 'morning' ? (
            <>
              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-border flex items-start gap-3 sm:gap-4">
                <div className="font-mono text-xs sm:text-sm font-bold text-brand-cyan bg-brand-cyan/10 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0">
                  09:00 AM
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Inaugural Ceremony & Keynote Address</h4>
                  <p className="text-xs text-brand-muted mt-1">Main College Auditorium with Distinguished Industry Dignitaries from Tech Giants.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-indigo/40 flex items-start gap-3 sm:gap-4">
                <div className="font-mono text-xs sm:text-sm font-bold text-brand-indigoLight bg-brand-indigo/10 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0">
                  10:00 AM
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
                    <span>Algorithmic Code Sprint & LensCraft Photography</span>
                    <Badge variant="technical" size="sm">Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Lab 3 (Turing Hall) & Open Amphitheatre Campus Grounds.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-indigo/40 flex items-start gap-3 sm:gap-4">
                <div className="font-mono text-xs sm:text-sm font-bold text-brand-indigoLight bg-brand-indigo/10 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0">
                  11:30 AM
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
                    <span>Full-Stack Web Dev Clash - Live Prompt Reveal</span>
                    <Badge variant="technical" size="sm">Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Incubation Center (Silicon Lab) - 4 Hour Sprint.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-border flex items-start gap-3 sm:gap-4">
                <div className="font-mono text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0">
                  01:00 PM
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Grand Buffet Lunch & Networking</h4>
                  <p className="text-xs text-brand-muted mt-1">College Central Dining Quadrangle (Complimentary for all participants).</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-cyan/40 flex items-start gap-3 sm:gap-4">
                <div className="font-mono text-xs sm:text-sm font-bold text-brand-cyan bg-brand-cyan/10 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0">
                  01:30 PM
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
                    <span>BGMI Esports Showdown - Custom Lobby Finals</span>
                    <Badge variant="nonTechnical" size="sm">Non-Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Student Activity Center (SAC 2) - Streamed Live to Big Screens.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-indigo/40 flex items-start gap-3 sm:gap-4">
                <div className="font-mono text-xs sm:text-sm font-bold text-brand-indigoLight bg-brand-indigo/10 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0">
                  02:00 PM
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
                    <span>National Paper Presentation Sessions</span>
                    <Badge variant="technical" size="sm">Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Auditorium Seminar Hall A & B (Judged by IEEE Chairpersons).</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-cyan/40 flex items-start gap-3 sm:gap-4">
                <div className="font-mono text-xs sm:text-sm font-bold text-brand-cyan bg-brand-cyan/10 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0">
                  02:30 PM
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
                    <span>The Da Vinci Code - Cryptic Treasure Hunt</span>
                    <Badge variant="nonTechnical" size="sm">Non-Technical</Badge>
                  </h4>
                  <p className="text-xs text-brand-muted mt-1">Campus-wide Checkpoints & Library Quadrangle.</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-border flex items-start gap-3 sm:gap-4">
                <div className="font-mono text-xs sm:text-sm font-bold text-amber-400 bg-amber-500/10 px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0">
                  04:30 PM
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Valedictory & Cash Prize Distribution</h4>
                  <p className="text-xs text-brand-muted mt-1">Trophy Handover, IEEE Certificate distribution, and Celebrity Evening.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-brand-border/40">
        <div className="text-center mb-10">
          <Badge variant="neutral" size="sm" className="mb-2">NEED HELP?</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl border border-brand-border/80 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-brand-cyan transition-colors gap-3"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-brand-muted shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-brand-cyan' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-brand-muted leading-relaxed border-t border-brand-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-12 border border-brand-indigo/40 text-center relative overflow-hidden bg-gradient-to-r from-brand-indigo/20 via-brand-dark to-brand-cyan/20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
            Ready to Prove Your Skills at ESEC Fiesta 2026?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-brand-muted max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            Slots are limited per college department. Secure your Technical and Non-Technical event passes now.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-105 active:scale-95 transition-all"
          >
            <span>Complete Registration Form</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};

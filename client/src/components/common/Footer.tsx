import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-brand-surface/90 border-t border-brand-border/60 text-brand-muted text-sm pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Institution */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-brand p-0.5">
                <div className="w-full h-full bg-brand-dark rounded-[6px] flex items-center justify-center font-mono font-bold text-brand-cyan text-sm">
                  ES
                </div>
              </div>
              <span className="font-bold text-white text-base tracking-wide font-sans">
                ESEC FIESTA 2026
              </span>
            </div>
            <p className="text-xs text-brand-muted/80 leading-relaxed">
              National Level Inter-Collegiate Technical & Cultural Symposium organized by Erode Sengunthar Engineering College. Unleash your innovation and creativity.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified AICTE & NAAC 'A' Accredited</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-brand-cyan transition-colors">Fest Overview & Schedule</Link></li>
              <li><Link to="/events" className="hover:text-brand-cyan transition-colors">Event Catalogue & Rules</Link></li>
              <li><Link to="/register" className="hover:text-brand-cyan transition-colors">Team & Solo Registration</Link></li>
              <li><Link to="/payment" className="hover:text-brand-cyan transition-colors">Payment Verification & UTR</Link></li>
              <li><Link to="/invoice/latest" className="hover:text-brand-cyan transition-colors">Download Official Receipt</Link></li>
            </ul>
          </div>

          {/* Col 3: Event Guidelines & Rule Constraints */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Important Rules</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-1.5">
                <span className="text-brand-cyan font-bold">•</span>
                <span>Max 1 Technical + Max 1 Non-Technical event per participant.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand-cyan font-bold">•</span>
                <span>Carry valid College ID & printable receipt on festival day.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-brand-cyan font-bold">•</span>
                <span>Free lunch & high-tea provided for all registered participants.</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Venue */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Venue & Helpdesk</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-indigo mt-0.5 shrink-0" />
                <span>Erode Sengunthar Engineering College, Thudupathi, Perundurai, Erode - 638057</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-cyan shrink-0" />
                <a href="mailto:fiesta2026@esec.ac.in" className="hover:text-white transition-colors">fiesta2026@esec.ac.in</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-indigo shrink-0" />
                <span>+91 98421 54321 / +91 94432 10987</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>© 2026 Erode Sengunthar Engineering College. All rights reserved.</p>
          <p className="font-mono text-[11px] text-brand-muted/70">
            Design Tokens: #0A0A0A • #4F46E5 • #06B6D4
          </p>
        </div>
      </div>
    </footer>
  );
};

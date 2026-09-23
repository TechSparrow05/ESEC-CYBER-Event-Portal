import React from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';

export const ConstraintBanner: React.FC = () => {
  const { 
    selectedTechnicalEvent, 
    selectedNonTechnicalEvent, 
    removeEvent, 
    constraintWarning,
    setConstraintWarning 
  } = useRegistration();

  return (
    <div className="w-full space-y-3">
      {/* Warning popup if rule violation attempted */}
      {constraintWarning && (
        <div className="flex items-start justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-sm animate-shake">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-300">Rule Constraint Applied</p>
              <p className="text-xs text-amber-200/90 mt-0.5">{constraintWarning}</p>
            </div>
          </div>
          <button 
            onClick={() => setConstraintWarning(null)} 
            className="text-amber-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Persistent Slot Tracker Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-brand-border/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-indigo/20 border border-brand-indigo/40 text-brand-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Festival Selection Constraints</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-brand-cyan">
                  1 Tech + 1 Non-Tech Max
                </span>
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Each participant UID can enroll in at most 1 Technical and 1 Non-Technical competition.
              </p>
            </div>
          </div>

          {/* Slot Badges */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Technical Slot */}
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all ${
              selectedTechnicalEvent 
                ? 'bg-brand-indigo/20 border-brand-indigo text-white' 
                : 'bg-brand-surface/60 border-dashed border-brand-border text-brand-muted'
            }`}>
              <span className="w-2 h-2 rounded-full bg-brand-indigo" />
              <span className="font-semibold text-brand-indigoLight">TECH:</span>
              {selectedTechnicalEvent ? (
                <div className="flex items-center gap-2">
                  <span className="font-sans font-medium text-white max-w-[130px] truncate">
                    {selectedTechnicalEvent.title}
                  </span>
                  <button 
                    onClick={() => removeEvent('Technical')}
                    className="hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="italic text-brand-muted/70">1 Slot Available</span>
              )}
            </div>

            {/* Non-Technical Slot */}
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all ${
              selectedNonTechnicalEvent 
                ? 'bg-brand-cyan/20 border-brand-cyan text-white' 
                : 'bg-brand-surface/60 border-dashed border-brand-border text-brand-muted'
            }`}>
              <span className="w-2 h-2 rounded-full bg-brand-cyan" />
              <span className="font-semibold text-brand-cyan">NON-TECH:</span>
              {selectedNonTechnicalEvent ? (
                <div className="flex items-center gap-2">
                  <span className="font-sans font-medium text-white max-w-[130px] truncate">
                    {selectedNonTechnicalEvent.title}
                  </span>
                  <button 
                    onClick={() => removeEvent('Non-Technical')}
                    className="hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="italic text-brand-muted/70">1 Slot Available</span>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

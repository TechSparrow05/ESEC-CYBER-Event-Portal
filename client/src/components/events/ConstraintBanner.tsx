import React from 'react';
import { AlertCircle, ShieldCheck, X } from 'lucide-react';
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
        <div className="flex items-start justify-between p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs sm:text-sm animate-shake">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-300">Rule Constraint Applied</p>
              <p className="text-xs text-amber-200/90 mt-0.5">{constraintWarning}</p>
            </div>
          </div>
          <button 
            onClick={() => setConstraintWarning(null)} 
            className="text-amber-400 hover:text-white p-1 shrink-0"
            aria-label="Dismiss warning"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Persistent Slot Tracker Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-brand-border/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4">
          
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-brand-indigo/20 border border-brand-indigo/40 text-brand-cyan shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex flex-wrap items-center gap-2">
                <span>Festival Selection Constraints</span>
                <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-brand-cyan">
                  1 Tech + 1 Non-Tech Max
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">
                Each participant UID can enroll in at most 1 Technical and 1 Non-Technical competition.
              </p>
            </div>
          </div>

          {/* Slot Badges: Fluid flex wrap */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Technical Slot */}
            <div className={`flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border text-xs font-mono transition-all ${
              selectedTechnicalEvent 
                ? 'bg-brand-indigo/20 border-brand-indigo text-white' 
                : 'bg-brand-surface/60 border-dashed border-brand-border text-brand-muted'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-brand-indigo shrink-0" />
                <span className="font-semibold text-brand-indigoLight shrink-0">TECH:</span>
                {selectedTechnicalEvent ? (
                  <span className="font-sans font-medium text-white truncate max-w-[120px] sm:max-w-[140px]">
                    {selectedTechnicalEvent.title}
                  </span>
                ) : (
                  <span className="italic text-brand-muted/70">1 Slot Free</span>
                )}
              </div>
              {selectedTechnicalEvent && (
                <button 
                  onClick={() => removeEvent('Technical')}
                  className="hover:text-red-400 transition-colors p-0.5 shrink-0"
                  title="Remove Technical Event"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Non-Technical Slot */}
            <div className={`flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border text-xs font-mono transition-all ${
              selectedNonTechnicalEvent 
                ? 'bg-brand-cyan/20 border-brand-cyan text-white' 
                : 'bg-brand-surface/60 border-dashed border-brand-border text-brand-muted'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-brand-cyan shrink-0" />
                <span className="font-semibold text-brand-cyan shrink-0">NON-TECH:</span>
                {selectedNonTechnicalEvent ? (
                  <span className="font-sans font-medium text-white truncate max-w-[120px] sm:max-w-[140px]">
                    {selectedNonTechnicalEvent.title}
                  </span>
                ) : (
                  <span className="italic text-brand-muted/70">1 Slot Free</span>
                )}
              </div>
              {selectedNonTechnicalEvent && (
                <button 
                  onClick={() => removeEvent('Non-Technical')}
                  className="hover:text-red-400 transition-colors p-0.5 shrink-0"
                  title="Remove Non-Technical Event"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

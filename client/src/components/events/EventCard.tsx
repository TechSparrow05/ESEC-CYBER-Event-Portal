import React, { useState } from 'react';
import { 
  Code, 
  Layout, 
  FileText, 
  Cpu, 
  Camera, 
  Gamepad2, 
  Compass, 
  Megaphone,
  Clock, 
  MapPin, 
  Users, 
  Check, 
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CollegeEvent } from '../../types';
import { Badge } from '../common/Badge';
import { useRegistration } from '../../context/RegistrationContext';

interface EventCardProps {
  event: CollegeEvent;
  onSelect?: () => void;
}

const iconMap: Record<string, any> = {
  Code,
  Layout,
  FileText,
  Cpu,
  Camera,
  Gamepad2,
  Compass,
  Megaphone
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [showRules, setShowRules] = useState(false);
  const { 
    selectedTechnicalEvent, 
    selectedNonTechnicalEvent, 
    selectEvent, 
    removeEvent 
  } = useRegistration();

  const IconComponent = iconMap[event.iconName] || Code;
  
  const isSelected = 
    (event.category === 'Technical' && selectedTechnicalEvent?.id === event.id) ||
    (event.category === 'Non-Technical' && selectedNonTechnicalEvent?.id === event.id);

  const isCategoryBlocked = 
    !isSelected && (
      (event.category === 'Technical' && selectedTechnicalEvent !== null) ||
      (event.category === 'Non-Technical' && selectedNonTechnicalEvent !== null)
    );

  const blockedByEventTitle = 
    event.category === 'Technical' 
      ? selectedTechnicalEvent?.title 
      : selectedNonTechnicalEvent?.title;

  const handleToggle = () => {
    if (isSelected) {
      removeEvent(event.category);
    } else {
      selectEvent(event);
    }
  };

  return (
    <div className={`relative flex flex-col justify-between rounded-2xl glass-panel border transition-all duration-300 p-6 ${
      isSelected 
        ? 'border-brand-indigo ring-1 ring-brand-indigo/60 shadow-glow-indigo bg-brand-surface/90' 
        : isCategoryBlocked
          ? 'border-brand-border/40 opacity-75 hover:opacity-100 hover:border-brand-border'
          : 'border-brand-border/70 glass-panel-hover'
    }`}>
      
      {/* Top Header: Category & Fee */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge variant={event.category === 'Technical' ? 'technical' : 'nonTechnical'}>
            {event.category}
          </Badge>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-xs text-brand-muted">Fee:</span>
            <span className="text-base font-extrabold text-white">₹{event.fee}</span>
          </div>
        </div>

        {/* Title & Icon */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className={`p-2.5 rounded-xl border shrink-0 ${
            event.category === 'Technical' 
              ? 'bg-brand-indigo/10 border-brand-indigo/30 text-brand-indigoLight' 
              : 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan'
          }`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors">
              {event.title}
            </h3>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              {event.shortDesc}
            </p>
          </div>
        </div>

        {/* Event Schedule & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4 pt-3 border-t border-brand-border/50 text-xs text-brand-muted font-sans">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
            <span className="truncate">{event.scheduleTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
            <Users className="w-3.5 h-3.5 text-brand-muted shrink-0" />
            <span>
              {event.isTeamEvent 
                ? `Team Event (${event.minTeamSize}-${event.maxTeamSize} Members)` 
                : 'Individual Entry'}
            </span>
          </div>
        </div>

        {/* Collapsible Rules Details */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowRules(!showRules)}
            className="flex items-center justify-between w-full text-[11px] font-mono font-semibold text-brand-muted hover:text-white py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3 h-3 text-brand-indigo" />
              Event Regulations ({event.rules.length} Rules)
            </span>
            {showRules ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          
          {showRules && (
            <ul className="mt-2 space-y-1.5 p-3 rounded-lg bg-black/40 border border-brand-border/60 text-xs text-brand-muted/90">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand-indigo font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="pt-3 border-t border-brand-border/50">
        {isSelected ? (
          <button
            type="button"
            onClick={handleToggle}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Selected (Click to Remove)</span>
          </button>
        ) : isCategoryBlocked ? (
          <button
            type="button"
            onClick={handleToggle}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
            title={`Replace ${blockedByEventTitle}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="truncate">Slot Busy • Replace {event.category}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-brand-surface hover:bg-brand-indigo border border-brand-border hover:border-brand-indigo transition-all shadow-sm hover:scale-[1.01]"
          >
            <span>Select Event</span>
          </button>
        )}
      </div>

    </div>
  );
};

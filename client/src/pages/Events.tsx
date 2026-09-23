import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';
import { DEFAULT_EVENTS } from '../data/events';
import { EventCard } from '../components/events/EventCard';
import { ConstraintBanner } from '../components/events/ConstraintBanner';
import { Badge } from '../components/common/Badge';
import { useRegistration } from '../context/RegistrationContext';

export const Events: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Technical' | 'Non-Technical' | 'Team' | 'Solo'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    cartTotal, 
    itemCount 
  } = useRegistration();

  const filteredEvents = useMemo(() => {
    return DEFAULT_EVENTS.filter(evt => {
      // Category / Type filter
      if (selectedFilter === 'Technical' && evt.category !== 'Technical') return false;
      if (selectedFilter === 'Non-Technical' && evt.category !== 'Non-Technical') return false;
      if (selectedFilter === 'Team' && !evt.isTeamEvent) return false;
      if (selectedFilter === 'Solo' && evt.isTeamEvent) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          evt.title.toLowerCase().includes(query) ||
          evt.description.toLowerCase().includes(query) ||
          evt.venue.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <div className="w-full min-h-screen py-8 sm:py-14 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1920px] mx-auto space-y-8 flex-1 flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge variant="indigo" size="sm" className="mb-2">COMPETITION ARENA</Badge>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white">Event Catalogue & Rules</h1>
          <p className="text-xs sm:text-base text-brand-muted mt-1.5 max-w-2xl">
            Choose up to 1 Technical and 1 Non-Technical challenge. Explore team dynamics, rules, venues, and cash rewards.
          </p>
        </div>

        {/* Live Cart Quick Status */}
        {itemCount > 0 && (
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-brand-surface border border-brand-indigo/50 shrink-0 self-start sm:self-auto shadow-glow-indigo">
            <div className="text-xs sm:text-sm">
              <span className="text-brand-muted">Selected: </span>
              <span className="font-bold text-white font-mono">{itemCount}/2 Events</span>
              <span className="text-brand-muted"> • Total: </span>
              <span className="font-bold text-brand-cyan font-mono">₹{cartTotal}</span>
            </div>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-indigo hover:bg-brand-indigoLight transition-all"
            >
              Continue
            </Link>
          </div>
        )}
      </div>

      {/* Mandatory Category Constraint Tracker Banner */}
      <ConstraintBanner />

      {/* Filter and Search Bar: Adaptive flex layout */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-brand-border/70 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['All', 'Technical', 'Non-Technical', 'Team', 'Solo'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-mono whitespace-nowrap transition-all shrink-0 ${
                selectedFilter === tab
                  ? 'bg-brand-indigo text-white shadow-glow-indigo'
                  : 'bg-brand-surface text-brand-muted hover:text-white border border-brand-border'
              }`}
            >
              {tab === 'All' ? 'All Events (8)' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search event title or venue..."
            className="w-full pl-11 pr-9 py-2.5 bg-brand-surface rounded-xl border border-brand-border focus:border-brand-indigo focus:outline-none text-xs sm:text-sm text-white placeholder-brand-muted font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Events Scalable Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 sm:gap-6">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-16 sm:py-24 glass-panel rounded-2xl border border-brand-border">
          <p className="text-sm text-brand-muted">No events match the selected criteria.</p>
          <button
            onClick={() => { setSelectedFilter('All'); setSearchQuery(''); }}
            className="mt-3 text-xs sm:text-sm font-semibold text-brand-cyan hover:underline"
          >
            Clear filters and search
          </button>
        </div>
      )}

      {/* Sticky Bottom Checkout Float Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-11/12 max-w-2xl z-40">
          <div className="glass-panel p-4 rounded-2xl border border-brand-indigo/60 shadow-2xl bg-brand-dark/95 backdrop-blur-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-brand-muted truncate">
                  {itemCount} of 2 Slots Filled
                </p>
                <p className="text-sm sm:text-base font-bold text-white font-mono truncate">
                  Payable: <span className="text-brand-cyan">₹{cartTotal}</span>
                </p>
              </div>
            </div>

            <Link
              to="/register"
              className="flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-brand shadow-glow-indigo hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CollegeEvent, UserRole, TeamDetails, RegistrationOrder } from '../types';
import { DEFAULT_EVENTS } from '../data/events';
import { apiClient } from '../services/api';

interface RegistrationContextType {
  roleType: UserRole;
  setRoleType: (role: UserRole) => void;
  selectedTechnicalEvent: CollegeEvent | null;
  selectedNonTechnicalEvent: CollegeEvent | null;
  selectEvent: (event: CollegeEvent) => { success: boolean; message?: string };
  removeEvent: (category: 'Technical' | 'Non-Technical') => void;
  teamCode: string;
  setTeamCode: (code: string) => void;
  teamName: string;
  setTeamName: (name: string) => void;
  verifiedTeam: TeamDetails | null;
  isVerifyingTeam: boolean;
  verifyTeamCode: (code: string) => Promise<boolean>;
  cartTotal: number;
  itemCount: number;
  clearSelection: () => void;
  allEvents: CollegeEvent[];
  constraintWarning: string | null;
  setConstraintWarning: (warning: string | null) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roleType, setRoleType] = useState<UserRole>('Solo');
  const [selectedTechnicalEvent, setSelectedTechnicalEvent] = useState<CollegeEvent | null>(null);
  const [selectedNonTechnicalEvent, setSelectedNonTechnicalEvent] = useState<CollegeEvent | null>(null);
  const [teamCode, setTeamCode] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [verifiedTeam, setVerifiedTeam] = useState<TeamDetails | null>(null);
  const [isVerifyingTeam, setIsVerifyingTeam] = useState<boolean>(false);
  const [constraintWarning, setConstraintWarning] = useState<string | null>(null);

  const allEvents = DEFAULT_EVENTS;

  /**
   * Enforces Hard Rule:
   * A user can pick AT MOST 1 Technical event and AT MOST 1 Non-Technical event.
   * Duplicate selection or attempting to choose multiple in the same category is blocked.
   */
  const selectEvent = (event: CollegeEvent): { success: boolean; message?: string } => {
    setConstraintWarning(null);

    if (event.category === 'Technical') {
      if (selectedTechnicalEvent) {
        if (selectedTechnicalEvent.id === event.id) {
          // Deselect if clicking the same one
          setSelectedTechnicalEvent(null);
          return { success: true };
        }
        // Block and alert
        const msg = `Constraint Violation: You already selected "${selectedTechnicalEvent.title}". You can register for AT MOST 1 Technical event. Please deselect it first.`;
        setConstraintWarning(msg);
        return { success: false, message: msg };
      }
      setSelectedTechnicalEvent(event);
      return { success: true };
    } else if (event.category === 'Non-Technical') {
      if (selectedNonTechnicalEvent) {
        if (selectedNonTechnicalEvent.id === event.id) {
          // Deselect if clicking the same one
          setSelectedNonTechnicalEvent(null);
          return { success: true };
        }
        // Block and alert
        const msg = `Constraint Violation: You already selected "${selectedNonTechnicalEvent.title}". You can register for AT MOST 1 Non-Technical event. Please deselect it first.`;
        setConstraintWarning(msg);
        return { success: false, message: msg };
      }
      setSelectedNonTechnicalEvent(event);
      return { success: true };
    }

    return { success: false, message: 'Unknown category' };
  };

  const removeEvent = (category: 'Technical' | 'Non-Technical') => {
    if (category === 'Technical') setSelectedTechnicalEvent(null);
    if (category === 'Non-Technical') setSelectedNonTechnicalEvent(null);
    setConstraintWarning(null);
  };

  const clearSelection = () => {
    setSelectedTechnicalEvent(null);
    setSelectedNonTechnicalEvent(null);
    setTeamCode('');
    setTeamName('');
    setVerifiedTeam(null);
    setConstraintWarning(null);
  };

  const verifyTeamCode = async (code: string): Promise<boolean> => {
    if (!code || code.trim().length < 4) return false;
    setIsVerifyingTeam(true);
    try {
      const res = await apiClient.validateTeamCode(code.trim());
      if (res.valid && res.team) {
        setVerifiedTeam(res.team);
        setIsVerifyingTeam(false);
        return true;
      }
    } catch (e) {
      console.warn('API team code check failed, checking mock demo codes', e);
    }

    // Demo code validation fallback (e.g., ESEC-TEAM, CODE99, BGMI01)
    if (code.toUpperCase().includes('ESEC') || code.length === 6) {
      const demoTeam: TeamDetails = {
        teamCode: code.toUpperCase(),
        teamName: 'Cyber Warriors ESEC',
        eventId: 'evt-tech-02',
        leaderId: 'usr_leader_01',
        members: ['usr_leader_01'],
        maxSize: 4
      };
      setVerifiedTeam(demoTeam);
      setIsVerifyingTeam(false);
      return true;
    }

    setVerifiedTeam(null);
    setIsVerifyingTeam(false);
    return false;
  };

  // Calculate dynamic fees
  const cartTotal = (selectedTechnicalEvent?.fee || 0) + (selectedNonTechnicalEvent?.fee || 0);
  const itemCount = (selectedTechnicalEvent ? 1 : 0) + (selectedNonTechnicalEvent ? 1 : 0);

  return (
    <RegistrationContext.Provider
      value={{
        roleType,
        setRoleType,
        selectedTechnicalEvent,
        selectedNonTechnicalEvent,
        selectEvent,
        removeEvent,
        teamCode,
        setTeamCode,
        teamName,
        setTeamName,
        verifiedTeam,
        isVerifyingTeam,
        verifyTeamCode,
        cartTotal,
        itemCount,
        clearSelection,
        allEvents,
        constraintWarning,
        setConstraintWarning
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) throw new Error('useRegistration must be used within a RegistrationProvider');
  return context;
};

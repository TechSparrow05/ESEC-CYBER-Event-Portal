import React, { createContext, useContext, useEffect, useState } from 'react';
import { ParticipantProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: any | null;
  profile: ParticipantProfile | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  signUp: (email: string, fullName: string, college: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<ParticipantProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for persistent preview session
const LOCAL_PROFILE_KEY = 'esec_participant_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<ParticipantProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize participant profile
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (data) {
              setProfile({
                id: data.id,
                participantId: data.participant_id,
                fullName: data.full_name,
                email: data.email,
                phone: data.phone || '',
                college: data.college,
                department: data.department || '',
                yearOfStudy: data.year_of_study || '3rd Year'
              });
              setIsLoading(false);
              return;
            }
          }
        }

        // Check local storage fallback for demo/developer convenience
        const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser({ id: parsed.id, email: parsed.email });
          setProfile(parsed);
        } else {
          // Default initial profile for quick preview
          const defaultParticipant: ParticipantProfile = {
            id: 'demo-user-' + Math.random().toString(36).substring(2, 8),
            participantId: 'EVT-2026-1042',
            fullName: 'Aravind Krishnan',
            email: 'aravind.k@esec.ac.in',
            phone: '+91 98421 54321',
            college: 'Erode Sengunthar Engineering College',
            department: 'Computer Science and Engineering',
            yearOfStudy: '3rd Year'
          };
          setUser({ id: defaultParticipant.id, email: defaultParticipant.email });
          setProfile(defaultParticipant);
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(defaultParticipant));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
    } else {
      // Demo login
      const mockProfile: ParticipantProfile = {
        id: 'usr_' + Date.now(),
        participantId: `EVT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: email.split('@')[0].toUpperCase(),
        email,
        phone: '+91 98765 43210',
        college: 'Erode Sengunthar Engineering College',
        department: 'B.E Computer Science & Engineering',
        yearOfStudy: 'Final Year'
      };
      setUser({ id: mockProfile.id, email });
      setProfile(mockProfile);
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(mockProfile));
    }
    setIsLoading(false);
  };

  const signUp = async (email: string, fullName: string, college: string, phone: string) => {
    setIsLoading(true);
    const newParticipantId = `EVT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProfile: ParticipantProfile = {
      id: 'usr_' + Date.now(),
      participantId: newParticipantId,
      fullName,
      email,
      phone,
      college,
      department: 'Information Technology',
      yearOfStudy: '3rd Year'
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'TemporarySecurePassword2026!'
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          participant_id: newParticipantId,
          full_name: fullName,
          email,
          phone,
          college
        });
      }
    }

    setUser({ id: newProfile.id, email });
    setProfile(newProfile);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProfile));
    setIsLoading(false);
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_PROFILE_KEY);
  };

  const updateProfile = (data: Partial<ParticipantProfile>) => {
    if (profile) {
      const updated = { ...profile, ...data };
      setProfile(updated);
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, signUp, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

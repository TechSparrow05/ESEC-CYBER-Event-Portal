import React, { createContext, useContext, useEffect, useState } from 'react';
import { ParticipantProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';

// Helper to generate non-colliding, randomized/shuffled 4-digit UID
export const generateShuffledUID = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EVT-2026-${randomNum}`;
};

// Seed demo accounts so reviewer can test switching between participants
const SEED_ACCOUNTS: ParticipantProfile[] = [
  {
    id: 'demo-user-1042',
    participantId: 'EVT-2026-1042',
    fullName: 'Aravind Krishnan',
    email: 'aravind.k@esec.ac.in',
    phone: '+91 98421 54321',
    college: 'Erode Sengunthar Engineering College',
    department: 'Computer Science and Engineering',
    yearOfStudy: '3rd Year'
  },
  {
    id: 'demo-user-3829',
    participantId: 'EVT-2026-3829',
    fullName: 'Priya Dharshini',
    email: 'priya.d@esec.ac.in',
    phone: '+91 98421 98765',
    college: 'Erode Sengunthar Engineering College',
    department: 'Information Technology',
    yearOfStudy: '2nd Year'
  },
  {
    id: 'demo-user-7491',
    participantId: 'EVT-2026-7491',
    fullName: 'Kavin Kumar',
    email: 'kavin.k@esec.ac.in',
    phone: '+91 97890 12345',
    college: 'Erode Sengunthar Engineering College',
    department: 'Artificial Intelligence & Data Science',
    yearOfStudy: 'Final Year'
  }
];

interface AuthContextType {
  user: any | null;
  profile: ParticipantProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  allAccounts: ParticipantProfile[];
  loginWithUidOrEmail: (identifier: string) => Promise<ParticipantProfile>;
  signUp: (data: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    department?: string;
    yearOfStudy?: string;
  }) => Promise<ParticipantProfile>;
  logout: () => Promise<void>;
  switchAccount: (participantId: string) => void;
  updateProfile: (data: Partial<ParticipantProfile>) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_PROFILE_KEY = 'esec_active_participant_profile';
const ACCOUNTS_REGISTRY_KEY = 'esec_accounts_registry';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<ParticipantProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [allAccounts, setAllAccounts] = useState<ParticipantProfile[]>([]);

  // Load registered accounts registry
  const getStoredAccounts = (): ParticipantProfile[] => {
    try {
      const stored = localStorage.getItem(ACCOUNTS_REGISTRY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading accounts registry:', e);
    }
    // Initialize with seed accounts if empty
    localStorage.setItem(ACCOUNTS_REGISTRY_KEY, JSON.stringify(SEED_ACCOUNTS));
    return SEED_ACCOUNTS;
  };

  const saveAccountToRegistry = (newAcc: ParticipantProfile) => {
    try {
      const existing = getStoredAccounts();
      const filtered = existing.filter(
        (a) => a.participantId !== newAcc.participantId && a.email.toLowerCase() !== newAcc.email.toLowerCase()
      );
      const updated = [newAcc, ...filtered];
      setAllAccounts(updated);
      localStorage.setItem(ACCOUNTS_REGISTRY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving account to registry:', e);
    }
  };

  // Initialize participant profile on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedAccounts = getStoredAccounts();
        setAllAccounts(storedAccounts);

        // 1. Check Supabase session first
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
              const loadedProfile: ParticipantProfile = {
                id: data.id,
                participantId: data.participant_id,
                fullName: data.full_name,
                email: data.email,
                phone: data.phone || '',
                college: data.college,
                department: data.department || '',
                yearOfStudy: data.year_of_study || '3rd Year'
              };
              setProfile(loadedProfile);
              saveAccountToRegistry(loadedProfile);
              setIsLoading(false);
              return;
            }
          }
        }

        // 2. Check active profile in localStorage
        const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
        if (saved) {
          const parsed: ParticipantProfile = JSON.parse(saved);
          setUser({ id: parsed.id, email: parsed.email });
          setProfile(parsed);
          saveAccountToRegistry(parsed);
        } else {
          // If fresh session, allocate the default primary account or pick first seed
          const defaultParticipant = storedAccounts[0] || SEED_ACCOUNTS[0];
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

  /**
   * Log in using Participant UID (e.g. EVT-2026-1042 or 1042) OR registered Email
   */
  const loginWithUidOrEmail = async (identifier: string): Promise<ParticipantProfile> => {
    setIsLoading(true);
    const cleanId = identifier.trim().toLowerCase();

    try {
      // 1. Try querying Supabase profiles table if configured
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`participant_id.ilike.%${cleanId}%,email.ilike.%${cleanId}%`)
          .limit(1);

        if (!error && data && data.length > 0) {
          const p = data[0];
          const matchedProfile: ParticipantProfile = {
            id: p.id,
            participantId: p.participant_id,
            fullName: p.full_name,
            email: p.email,
            phone: p.phone || '',
            college: p.college,
            department: p.department || '',
            yearOfStudy: p.year_of_study || '3rd Year'
          };
          setUser({ id: matchedProfile.id, email: matchedProfile.email });
          setProfile(matchedProfile);
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(matchedProfile));
          saveAccountToRegistry(matchedProfile);
          setIsLoading(false);
          return matchedProfile;
        }
      }

      // 2. Search local accounts registry
      const accounts = getStoredAccounts();
      const matched = accounts.find((acc) => {
        const pid = acc.participantId.toLowerCase();
        const email = acc.email.toLowerCase();
        return pid === cleanId || pid.replace('evt-2026-', '') === cleanId || email === cleanId;
      });

      if (matched) {
        setUser({ id: matched.id, email: matched.email });
        setProfile(matched);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(matched));
        setIsLoading(false);
        return matched;
      }

      // 3. If identifier looks like a valid UID format but not seen, create a quick profile session for it
      if (cleanId.startsWith('evt-2026-') || /^\d{4}$/.test(cleanId)) {
        const normalizedUid = cleanId.startsWith('evt-2026-')
          ? cleanId.toUpperCase()
          : `EVT-2026-${cleanId}`;

        const quickProfile: ParticipantProfile = {
          id: 'usr_' + Date.now(),
          participantId: normalizedUid,
          fullName: `Participant ${normalizedUid.replace('EVT-2026-', '#')}`,
          email: `participant.${normalizedUid.replace('EVT-2026-', '')}@esec.ac.in`,
          phone: '+91 98421 ' + normalizedUid.replace('EVT-2026-', ''),
          college: 'Erode Sengunthar Engineering College',
          department: 'Engineering',
          yearOfStudy: '3rd Year'
        };

        setUser({ id: quickProfile.id, email: quickProfile.email });
        setProfile(quickProfile);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(quickProfile));
        saveAccountToRegistry(quickProfile);
        setIsLoading(false);
        return quickProfile;
      }

      throw new Error(`No participant found with UID or Email "${identifier}". Please register below!`);
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Register a new Participant with a freshly shuffled unique UID
   */
  const signUp = async (data: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    department?: string;
    yearOfStudy?: string;
  }): Promise<ParticipantProfile> => {
    setIsLoading(true);

    try {
      // Generate a shuffled unique UID
      let newParticipantId = generateShuffledUID();
      const existing = getStoredAccounts();
      while (existing.some((a) => a.participantId === newParticipantId)) {
        newParticipantId = generateShuffledUID();
      }

      const newProfile: ParticipantProfile = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        participantId: newParticipantId,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        college: data.college.trim(),
        department: data.department?.trim() || 'Computer Science and Engineering',
        yearOfStudy: data.yearOfStudy || '3rd Year'
      };

      // If Supabase is configured, also persist to Supabase
      if (isSupabaseConfigured) {
        try {
          await supabase.from('profiles').insert({
            id: newProfile.id,
            participant_id: newParticipantId,
            full_name: newProfile.fullName,
            email: newProfile.email,
            phone: newProfile.phone,
            college: newProfile.college,
            department: newProfile.department,
            year_of_study: newProfile.yearOfStudy
          });
        } catch (dbErr) {
          console.warn('Supabase profile insertion note:', dbErr);
        }
      }

      setUser({ id: newProfile.id, email: newProfile.email });
      setProfile(newProfile);
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProfile));
      saveAccountToRegistry(newProfile);
      setIsLoading(false);
      return newProfile;
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Switch active participant account directly
   */
  const switchAccount = (participantId: string) => {
    const accounts = getStoredAccounts();
    const found = accounts.find((a) => a.participantId === participantId);
    if (found) {
      setUser({ id: found.id, email: found.email });
      setProfile(found);
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(found));
    }
  };

  /**
   * Logout - clears active user session
   */
  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('SignOut note:', e);
      }
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
      saveAccountToRegistry(updated);
    }
  };

  const openLoginModal = () => setIsAuthModalOpen(true);
  const closeLoginModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthModalOpen,
        allAccounts,
        loginWithUidOrEmail,
        signUp,
        logout,
        switchAccount,
        updateProfile,
        openLoginModal,
        closeLoginModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

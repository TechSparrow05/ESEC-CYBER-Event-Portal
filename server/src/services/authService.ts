import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

export interface ParticipantRecord {
  id: string;
  participantId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  yearOfStudy: string;
  createdAt: string;
}

export class AuthService {
  private supabaseClient: any = null;
  private memoryProfiles = new Map<string, ParticipantRecord>(); // participantId -> record
  private emailIndex = new Map<string, string>(); // email -> participantId

  constructor() {
    if (config.supabase.url && config.supabase.serviceRoleKey) {
      try {
        this.supabaseClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
          auth: { persistSession: false }
        });
      } catch (err) {
        console.warn('[AuthService] Supabase initialization failed, using memory store:', err);
      }
    }

    // Seed default accounts
    this.seedAccount({
      id: 'demo-user-1042',
      participantId: 'EVT-2026-1042',
      fullName: 'Aravind Krishnan',
      email: 'aravind.k@esec.ac.in',
      phone: '+91 98421 54321',
      college: 'Erode Sengunthar Engineering College',
      department: 'Computer Science and Engineering',
      yearOfStudy: '3rd Year',
      createdAt: new Date().toISOString()
    });

    this.seedAccount({
      id: 'demo-user-3829',
      participantId: 'EVT-2026-3829',
      fullName: 'Priya Dharshini',
      email: 'priya.d@esec.ac.in',
      phone: '+91 98421 98765',
      college: 'Erode Sengunthar Engineering College',
      department: 'Information Technology',
      yearOfStudy: '2nd Year',
      createdAt: new Date().toISOString()
    });

    this.seedAccount({
      id: 'demo-user-7491',
      participantId: 'EVT-2026-7491',
      fullName: 'Kavin Kumar',
      email: 'kavin.k@esec.ac.in',
      phone: '+91 97890 12345',
      college: 'Erode Sengunthar Engineering College',
      department: 'Artificial Intelligence & Data Science',
      yearOfStudy: 'Final Year',
      createdAt: new Date().toISOString()
    });
  }

  private seedAccount(record: ParticipantRecord) {
    this.memoryProfiles.set(record.participantId, record);
    this.emailIndex.set(record.email.toLowerCase(), record.participantId);
  }

  /**
   * Generate a randomized shuffled 4-digit unique participant ID
   */
  generateShuffledUID(): string {
    const randomInt = crypto.randomInt(1000, 10000);
    return `EVT-2026-${randomInt}`;
  }

  /**
   * Lookup participant by UID (e.g. EVT-2026-1042 or 1042) or email
   */
  async lookupParticipant(identifier: string): Promise<ParticipantRecord | null> {
    const clean = identifier.trim().toLowerCase();

    // 1. Try Supabase query
    if (this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient
          .from('profiles')
          .select('*')
          .or(`participant_id.ilike.%${clean}%,email.ilike.%${clean}%`)
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];
          return {
            id: row.id,
            participantId: row.participant_id,
            fullName: row.full_name,
            email: row.email,
            phone: row.phone || '',
            college: row.college,
            department: row.department || '',
            yearOfStudy: row.year_of_study || '3rd Year',
            createdAt: row.created_at || new Date().toISOString()
          };
        }
      } catch (err) {
        console.warn('[AuthService] Supabase lookup error:', err);
      }
    }

    // 2. Try in-memory profiles
    for (const record of this.memoryProfiles.values()) {
      const pid = record.participantId.toLowerCase();
      const email = record.email.toLowerCase();
      if (pid === clean || pid.replace('evt-2026-', '') === clean || email === clean) {
        return record;
      }
    }

    return null;
  }

  /**
   * Register a new participant with a unique shuffled UID
   */
  async registerParticipant(data: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    department?: string;
    yearOfStudy?: string;
  }): Promise<ParticipantRecord> {
    let participantId = this.generateShuffledUID();
    let attempts = 0;

    while (this.memoryProfiles.has(participantId) && attempts < 50) {
      participantId = this.generateShuffledUID();
      attempts++;
    }

    const newRecord: ParticipantRecord = {
      id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      participantId,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      college: data.college.trim(),
      department: data.department?.trim() || 'Computer Science and Engineering',
      yearOfStudy: data.yearOfStudy || '3rd Year',
      createdAt: new Date().toISOString()
    };

    // Store in memory
    this.memoryProfiles.set(newRecord.participantId, newRecord);
    this.emailIndex.set(newRecord.email.toLowerCase(), newRecord.participantId);

    // Persist to Supabase if configured
    if (this.supabaseClient) {
      try {
        await this.supabaseClient.from('profiles').insert({
          id: newRecord.id,
          participant_id: newRecord.participantId,
          full_name: newRecord.fullName,
          email: newRecord.email,
          phone: newRecord.phone,
          college: newRecord.college,
          department: newRecord.department,
          year_of_study: newRecord.yearOfStudy
        });
      } catch (dbErr) {
        console.warn('[AuthService] Supabase insertion note:', dbErr);
      }
    }

    return newRecord;
  }
}

export const authService = new AuthService();

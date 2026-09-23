export type EventCategory = 'Technical' | 'Non-Technical';

export interface CollegeEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  description: string;
  shortDesc: string;
  iconName: string;
  fee: number;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  scheduleTime: string;
  venue: string;
  rules: string[];
}

export type UserRole = 'Leader' | 'Member' | 'Solo';

export interface ParticipantProfile {
  id: string;
  participantId: string; // e.g. "EVT-2026-1001"
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  yearOfStudy: string;
}

export interface TeamDetails {
  id?: string;
  teamCode: string;
  teamName: string;
  eventId: string;
  leaderId: string;
  members: string[];
  maxSize: number;
}

export interface RegistrationOrder {
  id?: string;
  userId: string;
  roleType: UserRole;
  technicalEvent?: CollegeEvent | null;
  nonTechnicalEvent?: CollegeEvent | null;
  teamDetails?: TeamDetails | null;
  totalAmount: number;
  status: 'pending' | 'verified' | 'rejected';
  createdAt?: string;
}

export interface PaymentReceipt {
  paymentId: string;
  registrationId: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  collegeName: string;
  upiRefId: string; // 12 digits
  amount: number;
  vpa: string;
  screenshotUrl: string;
  timestamp: string;
  status: 'verified' | 'submitted';
  technicalEventTitle?: string;
  nonTechnicalEventTitle?: string;
  roleType: UserRole;
  teamCode?: string;
}

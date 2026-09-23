import { PaymentReceipt, TeamDetails } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  /**
   * Request GCS V4 Signed URL for direct screenshot upload
   */
  async getUploadUrl(file: File, userId: string): Promise<{ uploadUrl: string; publicUrl: string; objectKey: string; isMock: boolean }> {
    const res = await fetch(`${API_BASE_URL}/payments/upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        userId
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to obtain upload URL' }));
      throw new Error(err.error || 'Failed to obtain upload URL');
    }

    return res.json();
  },

  /**
   * Upload file directly to Google Cloud Storage using the signed URL
   */
  async uploadFileToSignedUrl(uploadUrl: string, file: File): Promise<void> {
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });

    if (!res.ok) {
      throw new Error(`Failed to upload file to storage: ${res.statusText}`);
    }
  },

  /**
   * Submit payment verification (12-digit UTR check)
   */
  async verifyPayment(payload: {
    registrationId: string;
    userId: string;
    upiRefId: string;
    screenshotUrl: string;
    amount: number;
  }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Payment verification failed' }));
      throw new Error(err.error || 'Payment verification failed');
    }

    return res.json();
  },

  /**
   * Create Team
   */
  async createTeam(teamName: string, eventId: string, leaderId: string, maxSize = 4): Promise<TeamDetails> {
    const res = await fetch(`${API_BASE_URL}/teams/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName, eventId, leaderId, maxSize })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create team' }));
      throw new Error(err.error || 'Failed to create team');
    }

    const data = await res.json();
    return data.team;
  },

  /**
   * Join Team with join code
   */
  async joinTeam(teamCode: string, userId: string): Promise<TeamDetails> {
    const res = await fetch(`${API_BASE_URL}/teams/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamCode, userId })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to join team' }));
      throw new Error(err.error || 'Failed to join team');
    }

    const data = await res.json();
    return data.team;
  },

  /**
   * Validate team code
   */
  async validateTeamCode(code: string): Promise<{ valid: boolean; team?: TeamDetails }> {
    const res = await fetch(`${API_BASE_URL}/teams/code/${encodeURIComponent(code)}`);
    if (!res.ok) {
      return { valid: false };
    }
    return res.json();
  },

  /**
   * Local storage receipt helpers to ensure reliable instant retrieval on /invoice/:id
   */
  saveReceiptLocal(receipt: PaymentReceipt): void {
    try {
      localStorage.setItem(`receipt_${receipt.paymentId}`, JSON.stringify(receipt));
      localStorage.setItem('latest_receipt_id', receipt.paymentId);
    } catch (e) {
      console.error('Failed to save receipt in localStorage', e);
    }
  },

  getReceiptLocal(paymentId: string): PaymentReceipt | null {
    try {
      const stored = localStorage.getItem(`receipt_${paymentId}`);
      if (stored) return JSON.parse(stored);
      // Fallback check if asking for 'latest'
      if (paymentId === 'latest') {
        const latestId = localStorage.getItem('latest_receipt_id');
        if (latestId) {
          const latestData = localStorage.getItem(`receipt_${latestId}`);
          if (latestData) return JSON.parse(latestData);
        }
      }
    } catch (e) {
      console.error('Failed to read receipt from localStorage', e);
    }
    return null;
  }
};

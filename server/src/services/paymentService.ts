import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

export interface VerifyPaymentPayload {
  registrationId: string;
  userId: string;
  upiRefId: string;
  screenshotUrl: string;
  amount: number;
}

export class PaymentService {
  private supabase = createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey || config.supabase.anonKey
  );

  // In-memory UTR store for local development preview / cache
  private localUtrStore = new Set<string>();
  private localPayments: Map<string, any> = new Map();

  /**
   * Validate and record a participant UPI transaction
   */
  async verifyAndRecordPayment(payload: VerifyPaymentPayload) {
    const { registrationId, userId, upiRefId, screenshotUrl, amount } = payload;

    // 1. Strict 12-digit format validation
    const utrRegex = /^[0-9]{12}$/;
    if (!utrRegex.test(upiRefId)) {
      throw new Error('Invalid UPI Reference ID: Must be an exact 12-digit numeric transaction number (UTR).');
    }

    // 2. Uniqueness check in memory
    if (this.localUtrStore.has(upiRefId)) {
      throw new Error('Duplicate Transaction: This 12-digit UPI Reference ID has already been submitted.');
    }

    // 3. Database uniqueness check if Supabase service key is present
    if (config.supabase.serviceRoleKey) {
      const { data: existingPayment, error: checkError } = await this.supabase
        .from('payments')
        .select('id, upi_ref_id')
        .eq('upi_ref_id', upiRefId)
        .maybeSingle();

      if (checkError) {
        console.error('[PaymentService] Error checking existing UTR in Supabase:', checkError);
      }

      if (existingPayment) {
        throw new Error('Duplicate Transaction: This 12-digit UPI Reference ID has already been recorded in database.');
      }

      // Record in Supabase
      const { data: newPayment, error: insertError } = await this.supabase
        .from('payments')
        .insert({
          registration_id: registrationId,
          user_id: userId,
          upi_ref_id: upiRefId,
          screenshot_url: screenshotUrl,
          amount,
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to save payment record: ${insertError.message}`);
      }

      this.localUtrStore.add(upiRefId);
      return newPayment;
    }

    // Mock mode response
    this.localUtrStore.add(upiRefId);
    const mockPayment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      registration_id: registrationId,
      user_id: userId,
      upi_ref_id: upiRefId,
      screenshot_url: screenshotUrl,
      amount,
      status: 'verified',
      verified_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    this.localPayments.set(mockPayment.id, mockPayment);

    return mockPayment;
  }

  getPaymentById(id: string) {
    return this.localPayments.get(id);
  }
}

export const paymentService = new PaymentService();

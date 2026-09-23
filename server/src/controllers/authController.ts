import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const authController = {
  /**
   * Lookup participant by UID or Email
   * GET /api/auth/lookup?identifier=EVT-2026-1042
   */
  async lookup(req: Request, res: Response) {
    try {
      const identifier = req.query.identifier as string;
      if (!identifier) {
        return res.status(400).json({ error: 'identifier query parameter is required (e.g. ?identifier=EVT-2026-1042)' });
      }

      const participant = await authService.lookupParticipant(identifier);
      if (!participant) {
        return res.status(404).json({ error: `Participant not found for "${identifier}"` });
      }

      return res.json({ success: true, participant });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Lookup failed' });
    }
  },

  /**
   * Register new participant with shuffled UID
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const { fullName, email, phone, college, department, yearOfStudy } = req.body;
      if (!fullName || !email || !phone || !college) {
        return res.status(400).json({ error: 'Missing mandatory fields: fullName, email, phone, college' });
      }

      const participant = await authService.registerParticipant({
        fullName,
        email,
        phone,
        college,
        department,
        yearOfStudy
      });

      return res.status(201).json({ success: true, participant });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Registration failed' });
    }
  }
};

import { Request, Response } from 'express';
import { teamService } from '../services/teamService';

export class TeamController {
  createTeam(req: Request, res: Response): void {
    try {
      const { teamName, eventId, leaderId, maxSize } = req.body;
      if (!teamName || !eventId || !leaderId) {
        res.status(400).json({ error: 'teamName, eventId, and leaderId are required.' });
        return;
      }

      const team = teamService.createTeam(teamName, eventId, leaderId, maxSize || 4);
      res.status(201).json({ success: true, team });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create team' });
    }
  }

  joinTeam(req: Request, res: Response): void {
    try {
      const { teamCode, userId } = req.body;
      if (!teamCode || !userId) {
        res.status(400).json({ error: 'teamCode and userId are required.' });
        return;
      }

      const team = teamService.joinTeam(teamCode, userId);
      res.status(200).json({ success: true, message: 'Successfully joined team', team });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to join team' });
    }
  }

  validateTeamCode(req: Request, res: Response): void {
    try {
      const { code } = req.params;
      const team = teamService.getTeamByCode(code);
      if (!team) {
        res.status(404).json({ valid: false, error: 'Team code not found or expired.' });
        return;
      }
      res.status(200).json({ valid: true, team });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const teamController = new TeamController();

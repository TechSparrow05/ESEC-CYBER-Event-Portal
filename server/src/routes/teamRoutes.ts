import { Router } from 'express';
import { teamController } from '../controllers/teamController';

const router = Router();

// POST /api/teams/create: Create team and get 6-digit join code
router.post('/create', (req, res) => teamController.createTeam(req, res));

// POST /api/teams/join: Join team using join code
router.post('/join', (req, res) => teamController.joinTeam(req, res));

// GET /api/teams/code/:code: Verify code exists
router.get('/code/:code', (req, res) => teamController.validateTeamCode(req, res));

export default router;

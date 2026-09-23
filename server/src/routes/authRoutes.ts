import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

router.get('/lookup', authController.lookup);
router.post('/register', authController.register);

export default router;

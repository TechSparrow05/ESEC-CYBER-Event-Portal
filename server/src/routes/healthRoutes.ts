import { Router } from 'express';
import { config } from '../config';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'college-event-backend',
    version: '1.0.0',
    storageMode: config.gcs.isConfigured ? 'Google Cloud Storage (Production)' : 'Development Simulation Storage',
    supabaseConnected: Boolean(config.supabase.url)
  });
});

export default router;

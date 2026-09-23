import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import paymentRoutes from './routes/paymentRoutes';
import teamRoutes from './routes/teamRoutes';
import healthRoutes from './routes/healthRoutes';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev server and production clients
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simulated storage endpoint for mock GCS uploads
const simulatedFiles = new Map<string, { buffer?: Buffer; contentType: string }>();

app.get('/mock-storage/*', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'image/png');
  // Return a simple 1x1 transparent PNG fallback or uploaded buffer
  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  res.send(pixel);
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/teams', teamRoutes);

// Root greeting
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'ESEC College Event Portal API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Global 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
const server = app.listen(config.port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 College Event Backend running on http://localhost:${config.port}`);
  console.log(`📡 Storage Mode: ${config.gcs.isConfigured ? 'Production GCS' : 'Mock Dev Storage'}`);
  console.log(`🔒 Supabase URL: ${config.supabase.url}`);
  console.log(`======================================================\n`);
});

export default app;

import dotenv from 'dotenv';
import path from 'path';

// Load .env from current directory or root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Google Cloud Storage
  gcs: {
    bucketName: process.env.GCS_BUCKET_NAME || 'college-event-esec-receipts',
    projectId: process.env.GCS_PROJECT_ID || 'esec-events-2026',
    clientEmail: process.env.GCS_CLIENT_EMAIL || '',
    privateKey: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    keyFilename: process.env.GCS_KEY_FILE || '',
    isConfigured: Boolean(
      (process.env.GCS_CLIENT_EMAIL && process.env.GCS_PRIVATE_KEY) ||
      process.env.GCS_KEY_FILE ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS
    )
  },

  // Supabase Config
  supabase: {
    url: process.env.SUPABASE_URL || 'https://esec-college-fest.supabase.co',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    anonKey: process.env.SUPABASE_ANON_KEY || 'dummy-anon-key'
  }
};

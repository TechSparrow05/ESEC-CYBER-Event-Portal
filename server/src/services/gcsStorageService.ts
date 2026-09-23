import { Storage } from '@google-cloud/storage';
import { config } from '../config';
import crypto from 'crypto';

export class GcsStorageService {
  private storage: Storage | null = null;
  private bucketName: string;

  constructor() {
    this.bucketName = config.gcs.bucketName;
    if (config.gcs.isConfigured) {
      if (config.gcs.keyFilename) {
        this.storage = new Storage({ keyFilename: config.gcs.keyFilename });
      } else if (config.gcs.clientEmail && config.gcs.privateKey) {
        this.storage = new Storage({
          projectId: config.gcs.projectId,
          credentials: {
            client_email: config.gcs.clientEmail,
            private_key: config.gcs.privateKey
          }
        });
      } else {
        this.storage = new Storage({ projectId: config.gcs.projectId });
      }
      console.log(`[GCS] Initialized Google Cloud Storage for bucket: ${this.bucketName}`);
    } else {
      console.warn('[GCS] Credentials not provided; running in local mock storage mode for development preview.');
    }
  }

  /**
   * Generates a signed URL for client-side direct upload
   * @param fileName Original file name
   * @param contentType MIME type (e.g. image/jpeg, image/png)
   * @param userId Participant ID or User UUID
   */
  async generateUploadSignedUrl(
    fileName: string,
    contentType: string,
    userId: string
  ): Promise<{ uploadUrl: string; publicUrl: string; objectKey: string; isMock: boolean }> {
    // Sanitize extension
    const extension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(4).toString('hex');
    const objectKey = `payments/${userId}/${timestamp}-${randomHex}.${extension}`;

    if (this.storage) {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(objectKey);

      // Generate v4 signed URL valid for 15 minutes
      const [uploadUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${objectKey}`;

      return {
        uploadUrl,
        publicUrl,
        objectKey,
        isMock: false
      };
    } else {
      // Local dev simulation upload URL
      const mockUploadUrl = `http://localhost:${config.port}/api/payments/mock-upload?key=${encodeURIComponent(objectKey)}`;
      const mockPublicUrl = `http://localhost:${config.port}/mock-storage/${objectKey}`;

      return {
        uploadUrl: mockUploadUrl,
        publicUrl: mockPublicUrl,
        objectKey,
        isMock: true
      };
    }
  }
}

export const gcsStorageService = new GcsStorageService();

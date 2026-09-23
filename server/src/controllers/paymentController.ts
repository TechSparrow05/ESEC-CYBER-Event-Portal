import { Request, Response } from 'express';
import { gcsStorageService } from '../services/gcsStorageService';
import { paymentService } from '../services/paymentService';

export class PaymentController {
  /**
   * Generates a signed URL for screenshot upload to Google Cloud Storage
   */
  async getUploadUrl(req: Request, res: Response): Promise<void> {
    try {
      const { fileName, contentType, userId } = req.body;

      if (!fileName || !contentType || !userId) {
        res.status(400).json({
          error: 'Missing required fields: fileName, contentType, and userId are required.'
        });
        return;
      }

      // Allowed content types for payment screenshot
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedMimeTypes.includes(contentType.toLowerCase())) {
        res.status(400).json({
          error: 'Invalid file format. Only JPEG, PNG, and WebP images are permitted for payment verification.'
        });
        return;
      }

      const result = await gcsStorageService.generateUploadSignedUrl(fileName, contentType, userId);
      res.status(200).json(result);
    } catch (err: any) {
      console.error('[PaymentController] Error creating upload URL:', err);
      res.status(500).json({ error: err.message || 'Failed to generate signed upload URL' });
    }
  }

  /**
   * Verify 12-digit UTR and complete payment submission
   */
  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { registrationId, userId, upiRefId, screenshotUrl, amount } = req.body;

      if (!registrationId || !userId || !upiRefId || !screenshotUrl) {
        res.status(400).json({
          error: 'Missing required fields: registrationId, userId, upiRefId, and screenshotUrl are required.'
        });
        return;
      }

      const payment = await paymentService.verifyAndRecordPayment({
        registrationId,
        userId,
        upiRefId,
        screenshotUrl,
        amount: Number(amount) || 0
      });

      res.status(200).json({
        success: true,
        message: 'Payment successfully submitted and verified.',
        payment
      });
    } catch (err: any) {
      console.error('[PaymentController] Error verifying payment:', err);
      res.status(400).json({ error: err.message || 'Payment verification failed' });
    }
  }

  /**
   * Mock upload endpoint for local development simulation when GCS credentials are empty
   */
  mockUpload(req: Request, res: Response): void {
    const key = req.query.key as string;
    console.log(`[MockGCS] Received simulated file upload for key: ${key}`);
    res.status(200).send({ success: true, message: 'Simulated GCS upload successful' });
  }
}

export const paymentController = new PaymentController();

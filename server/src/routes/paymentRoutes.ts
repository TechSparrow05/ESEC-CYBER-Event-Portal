import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';

const router = Router();

// POST /api/payments/upload-url: Generate GCS v4 pre-signed URL for direct upload
router.post('/upload-url', (req, res) => paymentController.getUploadUrl(req, res));

// POST /api/payments/verify: Verify 12-digit UTR and complete payment
router.post('/verify', (req, res) => paymentController.verifyPayment(req, res));

// PUT /api/payments/mock-upload: Mock endpoint when running without GCS credentials
router.put('/mock-upload', (req, res) => paymentController.mockUpload(req, res));
router.post('/mock-upload', (req, res) => paymentController.mockUpload(req, res));

export default router;

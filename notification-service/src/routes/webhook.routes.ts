import { Router } from 'express';
import { handleMidtransWebhook } from '../controller/webhook.controller';

const router = Router();

/**
 * @route   POST /api/v1/webhooks/midtrans
 * @desc    Handle incoming webhooks from Midtrans
 * @access  Public
 */
router.post('/midtrans', handleMidtransWebhook);

export default router;
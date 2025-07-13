import { Router } from 'express';
import { midtransWebhookHandler } from '../controller/webhook.controller';

const router = Router();

router.post('/midtrans', midtransWebhookHandler);

export default router;
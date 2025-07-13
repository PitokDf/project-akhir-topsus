import { Router } from 'express';
import notificationRoutes from './notification.routes';
import webhookRoutes from './webhook.routes';

const router = Router();

router.use('/notifications', notificationRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
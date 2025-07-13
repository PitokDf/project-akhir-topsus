import { Router } from 'express';
import { publishMessage } from '../controller/notification.controller';

const router = Router();

/**
 * @route   POST /api/v1/notifications/publish
 * @desc    Publish a message to RabbitMQ
 * @access  Public (for internal service-to-service communication)
 */
router.post('/publish', publishMessage);

export default router;
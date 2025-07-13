import { Request, Response } from 'express';
import { getChannel } from '../config/rabbitmq';
import { asyncHandler } from '../utils/async-handler';

export const midtransWebhookHandler = asyncHandler(async (req: Request, res: Response) => {
    const notification = req.body;

    const channel = getChannel();
    channel.sendToQueue('payment_notifications', Buffer.from(JSON.stringify(notification)));

    res.status(200).send('Notification received');
});
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { rabbitMQService } from '../service/rabbitmq.service';
import { logger } from '../utils/winston.logger';
import { HttpStatusCode } from '../constants/http-status';
import { MIDTRANS_SERVER_KEY } from '../config';
import { AppError } from '../errors/app-error';

const EXCHANGE_NAME = 'transaction_events';
const ROUTING_KEY_PAYMENT_UPDATE = 'transaction.payment.updated';

export const handleMidtransWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = req.body;
        console.log(notification);

        // Validasi Signature Key
        const signatureKey = crypto
            .createHash('sha512')
            .update(
                `${notification.order_id}${notification.status_code}${notification.gross_amount}${MIDTRANS_SERVER_KEY}`
            )
            .digest('hex');

        if (signatureKey !== notification.signature_key) {
            throw new AppError('Invalid signature key', HttpStatusCode.FORBIDDEN);
        }

        // Jika valid, publish ke RabbitMQ
        const channel = rabbitMQService.getChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

        const messageBuffer = Buffer.from(JSON.stringify(notification));
        channel.publish(EXCHANGE_NAME, ROUTING_KEY_PAYMENT_UPDATE, messageBuffer);

        logger.info(
            `Midtrans notification for order ${notification.order_id} processed and published with routing key '${ROUTING_KEY_PAYMENT_UPDATE}'`
        );

        res.status(HttpStatusCode.OK).json({
            status: 'success',
            message: 'Notification received and validated successfully.',
        });
    } catch (error) {
        next(error);
    }
};
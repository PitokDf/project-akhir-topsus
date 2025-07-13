import { Request, Response, NextFunction } from 'express';
import { rabbitMQService } from '../service/rabbitmq.service';
import { logger } from '../utils/winston.logger';
import { HttpStatusCode } from '../constants/http-status';

const EXCHANGE_NAME = 'transaction_events';

export const publishMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { routingKey, message } = req.body;

        if (!routingKey || !message) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                status: 'error',
                message: 'Routing key and message are required.',
            });
        }

        const channel = rabbitMQService.getChannel();

        // Pastikan exchange ada sebelum mem-publish
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

        // Ubah pesan menjadi buffer
        const messageBuffer = Buffer.from(JSON.stringify(message));

        // Publish pesan ke exchange dengan routing key yang diberikan
        channel.publish(EXCHANGE_NAME, routingKey, messageBuffer);

        logger.info(`Message published to exchange '${EXCHANGE_NAME}' with routing key '${routingKey}'`);

        res.status(HttpStatusCode.OK).json({
            status: 'success',
            message: 'Message published successfully.',
        });
    } catch (error) {
        next(error);
    }
};
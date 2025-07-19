import { Channel, ConsumeMessage } from 'amqplib';
import { rabbitMQService } from '../service/rabbitmq.service';
import logger from '../utils/winston.logger';
import * as TransactionService from '../service/transaction.service';

const EXCHANGE_NAME = 'transaction_events';
const QUEUE_NAME = 'payment_update_queue'; // Nama queue yang berbeda dari notification-service
const ROUTING_KEY = 'transaction.payment.updated';

// Fungsi untuk menerjemahkan status Midtrans ke status internal
const translateStatus = (midtransStatus: string): 'PENDING' | 'SUCCESS' | 'CANCELLED' | 'FAILED' | 'EXPIRED' | null => {
    switch (midtransStatus) {
        case 'settlement':
            return 'SUCCESS';
        case 'pending':
            return 'PENDING';
        case 'cancel':
        case 'deny':
            return 'CANCELLED';
        case 'expire':
            return 'EXPIRED';
        default:
            return null;
    }
};

export const startPaymentWorker = async () => {
    logger.info('Starting payment worker...');
    try {
        const channel = rabbitMQService.getChannel();

        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
        const q = await channel.assertQueue(QUEUE_NAME, { durable: true });
        logger.info(`Payment worker is waiting for messages in queue: ${q.queue}`);

        await channel.bindQueue(q.queue, EXCHANGE_NAME, ROUTING_KEY);

        channel.consume(q.queue, async (msg: ConsumeMessage | null) => {
            if (msg) {
                try {
                    const notification = JSON.parse(msg.content.toString());
                    logger.info(`[${ROUTING_KEY}] Received notification for order: ${notification.order_id}`);

                    const internalStatus = translateStatus(notification.transaction_status);

                    if (internalStatus) {
                        await TransactionService.updateTransactionStatus(notification.order_id, internalStatus);
                        logger.info(`Transaction ${notification.order_id} status updated to ${internalStatus}`);
                    } else {
                        logger.warn(`Ignoring unknown transaction status: ${notification.transaction_status}`);
                    }

                    channel.ack(msg);
                } catch (error: any) {
                    logger.error('Error processing payment notification', {
                        message: error.message,
                        stack: error.stack,
                        orderId: JSON.parse(msg.content.toString())?.order_id,
                    });
                    // Nack (negative acknowledgment) untuk mengembalikan pesan ke antrian jika terjadi error
                    channel.nack(msg, false, false); // false kedua berarti tidak requeue, kirim ke DLX jika ada
                }
            }
        }, { noAck: false });
    } catch (error: any) {
        logger.error('Failed to start payment worker', {
            message: error.message,
            stack: error.stack,
        });
    }
};
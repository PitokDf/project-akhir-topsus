import { getChannel } from '../config/rabbitmq';
import amqp from 'amqplib';
import * as TransactionRepository from '../repositories/transaction.repository';

export const startPaymentWorker = () => {
    const channel = getChannel();
    const queue = 'payment_notifications';

    channel.consume(queue, async (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
            const notification = JSON.parse(msg.content.toString());
            const { order_id, transaction_status } = notification;

            if (transaction_status === 'capture' || transaction_status === 'settlement') {
                await TransactionRepository.updateTransactionStatus(order_id, 'completed');
            } else if (transaction_status === 'cancel' || transaction_status === 'expire') {
                await TransactionRepository.updateTransactionStatus(order_id, 'failed');
            }

            channel.ack(msg);
        }
    });
};
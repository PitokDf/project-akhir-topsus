import { rabbitMQService } from '../service/rabbitmq.service';
import { logger } from '../utils/winston.logger';

const EXCHANGE_NAME = 'transaction_events';
const QUEUE_NAME = 'notification_queue';
const ROUTING_KEY = 'transaction.created';

export const startTransactionWorker = async () => {
    try {
        const channel = rabbitMQService.getChannel();

        // Assert Exchange: Pastikan exchange-nya ada, jika tidak maka buat.
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

        // Assert Queue: Pastikan queue-nya ada, jika tidak maka buat.
        const q = await channel.assertQueue(QUEUE_NAME, { durable: true });
        logger.info(`Worker is waiting for messages in queue: ${q.queue}`);

        // Bind Queue to Exchange: Ikat queue ke exchange dengan routing key tertentu.
        await channel.bindQueue(q.queue, EXCHANGE_NAME, ROUTING_KEY);

        //Consume Messages: Mulai mendengarkan pesan dari queue.
        channel.consume(
            q.queue,
            (msg) => {
                if (msg) {
                    const messageContent = msg.content.toString();
                    logger.info(`[${ROUTING_KEY}] Received message: ${messageContent}`);

                    // Proses pesan di sini (misalnya, kirim email, notifikasi, dll.)

                    // Acknowledge pesan setelah berhasil diproses
                    channel.ack(msg);
                }
            },
            { noAck: false } // 'noAck: false' berarti kita akan mengirim acknowledgment manual
        );
    } catch (error) {
        logger.error('Failed to start transaction worker', error);
    }
};
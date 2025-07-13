import amqp, { Channel, Connection } from 'amqplib';
import { RABBITMQ_URL } from '../config';
import { logger } from '../utils/winston.logger';

class RabbitMQService {
    private connection: any | null = null;
    private channel: Channel | null = null;

    public async connect(): Promise<void> {
        try {
            if (this.channel && this.connection) {
                logger.info('Already connected to RabbitMQ.');
                return;
            }

            this.connection = await amqp.connect(RABBITMQ_URL);
            this.channel = await this.connection.createChannel();

            logger.info('Successfully connected to RabbitMQ and channel created.');

            this.connection.on('error', (err: any) => {
                logger.error('RabbitMQ connection error', err);
                this.reconnect();
            });

            this.connection.on('close', () => {
                logger.warn('RabbitMQ connection closed. Attempting to reconnect...');
                this.reconnect();
            });

        } catch (error) {
            logger.error('Failed to connect to RabbitMQ', error);
            // Retry connection after a delay
            setTimeout(() => this.reconnect(), 5000);
        }
    }

    private async reconnect(): Promise<void> {
        this.channel = null;
        this.connection = null;
        await this.connect();
    }

    public getChannel(): Channel {
        if (!this.channel) {
            throw new Error('RabbitMQ channel is not available. Please connect first.');
        }
        return this.channel;
    }

    public async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
            logger.info('RabbitMQ connection closed successfully.');
        } catch (error) {
            logger.error('Failed to close RabbitMQ connection', error);
        }
    }
}

export const rabbitMQService = new RabbitMQService();
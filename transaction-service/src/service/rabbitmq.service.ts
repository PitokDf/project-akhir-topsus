import amqp, { Channel, Connection } from 'amqplib';
import { config } from '../config';
import logger from '../utils/winston.logger';

class RabbitMQService {
    private connection: any | null = null;
    private channel: Channel | null = null;
    private retryAttempts = 0;
    private maxRetryAttempts = 10;
    private retryDelay = 5000; // 5 seconds

    public async connect(): Promise<void> {
        try {
            if (this.channel && this.connection) {
                logger.info('Already connected to RabbitMQ.');
                return;
            }

            this.connection = await amqp.connect(config.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();

            logger.info('Successfully connected to RabbitMQ and channel created.');
            this.retryAttempts = 0; // Reset retry attempts on successful connection

            this.connection.on('error', (err: any) => {
                logger.error('RabbitMQ connection error', err);
                if (!this.connection?.close) this.reconnect();
            });

            this.connection.on('close', () => {
                logger.warn('RabbitMQ connection closed. Attempting to reconnect...');
                this.reconnect();
            });

        } catch (error) {
            logger.error(`Failed to connect to RabbitMQ: ${(error as Error).message}`);
            this.reconnect();
        }
    }

    private async reconnect(): Promise<void> {
        if (this.retryAttempts < this.maxRetryAttempts) {
            this.retryAttempts++;
            const delay = this.retryDelay * Math.pow(2, this.retryAttempts - 1);
            logger.info(`Attempting to reconnect to RabbitMQ in ${delay / 1000} seconds... (Attempt ${this.retryAttempts}/${this.maxRetryAttempts})`);

            setTimeout(() => this.connect(), delay);
        } else {
            logger.error('Max retry attempts reached. Could not connect to RabbitMQ.');
        }
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
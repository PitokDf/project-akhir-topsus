import amqp from 'amqplib';

const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();
        await channel.assertQueue('payment_notifications', { durable: true });
        console.log('✅ RabbitMQ connected');
    } catch (error) {
        console.error('❌ RabbitMQ connection error:', error);
    }
};

export const getChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel is not available.');
    }
    return channel;
};
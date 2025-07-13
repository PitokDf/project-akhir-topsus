import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 4005;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
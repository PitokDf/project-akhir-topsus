import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
    url: redisUrl,
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis connected');
    } catch (error) {
        console.error('❌ Redis connection error:', error);
    }
};

export default redisClient;
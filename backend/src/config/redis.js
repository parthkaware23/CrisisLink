const redis = require('redis');

// Redis client create karna
const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379' // localhost ki jagah 127.0.0.1 karke dekh
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect karne ka function
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Connected to Redis! 🚀");
    }
};

connectRedis();

module.exports = redisClient;
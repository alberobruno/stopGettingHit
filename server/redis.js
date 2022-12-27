const redis = require('redis');
const redisClient = redis.createClient({ socket: { port: 6379 } });
redisClient.on('connect', function() {
  console.log('Connected to Redis!');
});

module.exports = redisClient;


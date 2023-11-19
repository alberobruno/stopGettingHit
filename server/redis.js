const redis = require("redis");

// const client = redis.createClient({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
// });
// import { createClient } from 'redis';

const client = createClient({
  password: "slab-coping-flying",
  socket: {
    host: "redis-12503.c8.us-east-1-2.ec2.cloud.redislabs.com",
    port: 12503,
  },
});
client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.log("Redis error: ", err);
});

module.exports = client;

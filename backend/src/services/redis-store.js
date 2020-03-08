const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

const store = new redisStore({ host: 'localhost', port: 6789, client: redisClient, ttl: 3600 });

module.exports = store;
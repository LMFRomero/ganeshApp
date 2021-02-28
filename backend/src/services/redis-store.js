const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);

require('dotenv').config();

const sessionClient = redis.createClient({
    db: 0,
    host: `${process.env.REDIS_HOSTNAME}`,
    port: '6379'
});

sessionClient.on('connect', () => {
    console.log('Session connected!');
});

sessionClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

const frequencyClient = redis.createClient({
    db: 1,
    host: `${process.env.REDIS_HOSTNAME}`,
    port: '6379'
});

frequencyClient.on('connect', () => {
    console.log('Frequency connected!');
});

frequencyClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

module.exports = {
    sessionStore: new redisStore({ client: sessionClient, ttl: 3600 }),
    frequencyClient
}
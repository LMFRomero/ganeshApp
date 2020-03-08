const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const timeout = require('connect-timeout');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
require('dotenv').config();

const redisClient = redis.createClient();
app = express();

mongoose.connect(`${process.env.GANESH_CLUSTER}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

app.use(timeout('10s'));
app.use(cors());
app.use(express.json());
app.use(routes);

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: `${process.env.REDIS_SECRET}`,
}));

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next();
}

app.listen(3333);

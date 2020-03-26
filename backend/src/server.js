const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const timeout = require('connect-timeout');

const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redis = require('redis');

const bodyParser = require('body-parser');
const passport = require('passport');
const passaportConfig = require('./services/passaport');

const cookieParser = require('cookie-parser');


const store = require('./services/redis-store');
require('dotenv').config();

const redisClient = redis.createClient();
app = express();
app.set('trustproxy', true)
app.use(cookieParser(`${process.env.REDIS_SECRET}`));

app.use(cors({
    credentials: true,
    origin: 'http://ganeshfront.ddns.net:3000'
}));

app.use(express.static('public'));

app.use(session({
    resave: true,
    name: "ganeshSession",
    saveUninitialized: false,
    cookie: { domain:`143.107.252.110`, secure: false, httpOnly: true, sameSite: 'none', maxAge: 3600000 }, //TODO: change secure to true
    secret: `${process.env.REDIS_SECRET}`,
    store: store,
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect(`${process.env.GANESH_CLUSTER}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});


redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

app.use(timeout('10s'));
app.use(express.json());
app.use(routes);


function haltOnTimedout (req, res, next) {
    if (!req.timedout) next();
}

app.listen(3333);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const timeout = require('connect-timeout');

const session = require('express-session');
const myStore = require('./services/redis-store');
const redis = require('redis');
const redisClient = redis.createClient();

const passport = require('passport');
const passaportConfig = require('./services/passaport');

const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');

require('dotenv').config();

app = express();
app.set('trustproxy', true)
app.use(cookieParser(`${process.env.REDIS_SECRET}`));
app.use(multer().array());

app.use(cors({
    credentials: true,
    origin: 'http://ganeshfront.ddns.net:3000'
}));

const assetsPath = path.join(__dirname, './public');
app.use(express.static(assetsPath));

app.use(session({
    resave: false,
    name: "ganeshSession",
    saveUninitialized: true,
    cookie: {secure: false, httpOnly: true, sameSite: 'none', maxAge: 3600000 }, //TODO: change secure to true
    secret: `${process.env.REDIS_SECRET}`,
    store: myStore,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`${process.env.GANESH_CLUSTER}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use(timeout('10s'));
app.use(express.json());
app.use(routes);

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next();
}

app.listen(3333);

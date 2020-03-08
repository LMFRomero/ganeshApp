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

const store = require('./services/redis-store');

require('dotenv').config();

app = express();
app.use(cors());


app.options(`*`, (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));

app.use(session({
    resave: false,
    name: "ganeshSession",
    saveUninitialized: false,
    cookie: { domain:`192.168.0.13`, secure: false, httpOnly: false, sameSite: `none`, maxAge: 3600000 }, //TODO: change secure to true
    secret: `${process.env.REDIS_SECRET}`,
    store: store,
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect(`${process.env.GANESH_CLUSTER}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.use(timeout('10s'));
app.use(express.json());
app.use(routes);


function haltOnTimedout (req, res, next) {
    if (!req.timedout) next();
}

app.listen(3333);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const timeout = require('connect-timeout');

const session = require('express-session');
const redis = require('./services/redis-store');

const passport = require('passport');
const passportConfig = require('./services/passport');

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
    origin: [`http://${process.env.REACT_HOSTNAME}:3000`, 'http://localhost:3000'],
    exposedHeaders: ["set-cookie"]
}));

const assetsPath = path.join(__dirname, './public');
app.use(express.static(assetsPath));

app.use(session({
    resave: true,
    name: "ganeshSession",
    saveUninitialized: true,
    cookie: {
        secure: false, 
        httpOnly: false, 
        sameSite: 'strict', 
        maxAge: 3600000 
    }, //TODO: change secure to true
    secret: `${process.env.REDIS_SECRET}`,
    store: redis.sessionStore,
}));
app.use(passport.initialize());
app.use(passport.session());

try {
    mongoose.connect(`mongodb://${process.env.MONGODB_HOSTNAME}:27017/ganeshapp`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");    
} catch (error) {
    console.log("MongoDB Error");
    console.log(error);
}

app.use(timeout('10s'));
app.use(express.json());
app.use(routes);

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next();
}

app.listen(3333);

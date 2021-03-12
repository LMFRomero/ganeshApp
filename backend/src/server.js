const express = require('express');
const mongoose = require('mongoose');
const timeout = require('connect-timeout');
const path = require('path');

const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const multer = require('multer');
const redis = require('./services/redis-store');

const sessionRoutes = require('./routes/session');
const userRoutes = require('./routes/user');
const frontRoutes = require('./routes/front');
const meetingRoutes = require('./routes/meeting');
const devRoutes = require('./routes/dev');

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

app.use('/api/session', sessionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/front', frontRoutes);
app.use('/api/dev', devRoutes);

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next();
}

app.listen(3333);

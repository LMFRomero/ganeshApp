const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.GMAIL_SERVICE_NAME,
    host: process.env.GMAIL_SERVICE_HOST,
    secure: process.env.GMAIL_SERVICE_SECURE,
    port: process.env.GMAIL_SERVICE_PORT,
    auth: {
        user: process.env.GMAIL_USER_EMAIL,
        pass: process.env.GMAIL_USER_PASSWORD
    }
});

module.exports = transporter;
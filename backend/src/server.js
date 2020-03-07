const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();

app = express();

mongoose.connect(`${process.env.GANESH_CLUSTER}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);

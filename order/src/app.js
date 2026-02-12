const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(express.json());
app.use(cookieParser());
const orderRoute = require('./routes/order.route');

app.use('/api/order', orderRoute);




module.exports = app;
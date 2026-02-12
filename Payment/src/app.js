const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(express.json());
app.use(cookieParser());
const paymentRoutes = require('./routes/payment.route');
app.use('/api/payment', paymentRoutes);





module.exports = app; 
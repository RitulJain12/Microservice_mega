const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const cartRouter = require('./routes/cart.routes');
const app = express();

// CORS configuration to allow requests from frontend
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true // Allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/cart', cartRouter);


module.exports = app; 
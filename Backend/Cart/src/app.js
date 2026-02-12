const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const cartRouter = require('./routes/cart.routes');
const app = express();


app.use(cors({
    origin: true, 
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/cart', cartRouter);


module.exports = app; 
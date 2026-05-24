const express = require('express');
const cors = require('cors');
const recommendationRoutes = require('./routes/recommendation.routes');

const app = express();

const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:3010'];
app.use(cors({
    origin: corsOrigins, 
    credentials: true
}));
app.use(express.json());

app.use('/', recommendationRoutes);

app.get('/health', (req, res) => {
    res.send('Recommendation Service is running');
});

module.exports = app;
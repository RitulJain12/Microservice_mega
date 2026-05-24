const { createClient } =require('redis');
require('dotenv').config();

const redisOptions = {};
if (process.env.REDIS_URL) {
    redisOptions.url = process.env.REDIS_URL;
} else {
    redisOptions.username = process.env.REDIS_USERNAME || 'default';
    redisOptions.password = process.env.REDIS_PASSWORD;
    redisOptions.socket = {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    };
}

const client = createClient(redisOptions);

client.on('error', err => console.log('Redis Client Error', err));




module.exports=client;


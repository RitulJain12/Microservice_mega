require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();


app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));

const { createProxyMiddleware } = require('http-proxy-middleware');
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000,
	limit: 30,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
}) 
app.use(limiter)

console.log("API Gateway proxy configuration loaded");

const proxyOptions = {
	changeOrigin: true,

	onProxyRes: function (proxyRes, req, res) {

	}
};

app.use('/user', createProxyMiddleware({
	...proxyOptions,
	target: 'http://localhost:3000',
	pathRewrite: { '^/user': '' }
}));

app.use('/product', createProxyMiddleware({
	target: 'http://localhost:3001',
	changeOrigin: true,
	pathRewrite: { '^/product': '' }
}));

app.use('/cart', createProxyMiddleware({
	target: 'http://localhost:3002',
	changeOrigin: true,
	pathRewrite: { '^/cart': '' }
}));

app.use('/order', createProxyMiddleware({
	target: 'http://localhost:3003',
	changeOrigin: true,
	pathRewrite: { '^/order': '' }
}));

app.use('/payment', createProxyMiddleware({
	target: 'http://localhost:3004',
	changeOrigin: true,
	pathRewrite: { '^/payment': '' }
}));

app.use('/ai-buddy', createProxyMiddleware({
	target: 'http://localhost:3005',
	changeOrigin: true,
	pathRewrite: { '^/ai-buddy': '' }
}));

app.use('/notification', createProxyMiddleware({
	target: 'http://localhost:3006',
	changeOrigin: true,
	pathRewrite: { '^/notification': '' }
}));

app.use('/recommendations', createProxyMiddleware({
	...proxyOptions,
	target: 'http://localhost:3009',
	pathRewrite: { '^/recommendations': '' }
}));

app.use('/seller', createProxyMiddleware({
	target: 'http://localhost:3007',
	changeOrigin: true,
	pathRewrite: { '^/seller': '' }
}));




app.listen(process.env.PORT, () => {
	console.log(`API Gateway is running on port ${process.env.PORT}`);
});



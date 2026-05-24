require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();


app.use(cors({
	origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));

const { createProxyMiddleware } = require('http-proxy-middleware');

console.log("API Gateway proxy configuration loaded");

const proxyOptions = {
	changeOrigin: true,
};

app.use('/user', createProxyMiddleware({
	...proxyOptions,
	target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
	pathRewrite: { '^/user': '' }
}));

app.use('/product', createProxyMiddleware({
	...proxyOptions,
	target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
	pathRewrite: { '^/product': '' }
}));

app.use('/cart', createProxyMiddleware({
	...proxyOptions,
	target: process.env.CART_SERVICE_URL || 'http://localhost:3002',
	pathRewrite: { '^/cart': '' }
}));

app.use('/order', createProxyMiddleware({
	...proxyOptions,
	target: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
	pathRewrite: { '^/order': '' }
}));

app.use('/payment', createProxyMiddleware({
	...proxyOptions,
	target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
	pathRewrite: { '^/payment': '' }
}));

app.use('/ai-buddy', createProxyMiddleware({
	...proxyOptions,
	target: process.env.AIBUDDY_SERVICE_URL || 'http://localhost:3005',
	pathRewrite: { '^/ai-buddy': '' }
}));

app.use('/notification', createProxyMiddleware({
	...proxyOptions,
	target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
	pathRewrite: { '^/notification': '' }
}));

app.use('/recommendations', createProxyMiddleware({
	...proxyOptions,
	target: process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:3009',
	pathRewrite: { '^/recommendations': '' }
}));

app.use('/seller', createProxyMiddleware({
	...proxyOptions,
	target: process.env.SELLER_SERVICE_URL || 'http://localhost:3008',
	pathRewrite: { '^/seller': '' }
}));

app.listen(process.env.PORT || 5000, () => {
	console.log(`API Gateway is running on port ${process.env.PORT || 5000}`);
});



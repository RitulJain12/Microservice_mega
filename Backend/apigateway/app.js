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

app.use('/product/api', createProxyMiddleware({
	...proxyOptions,
	target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
	pathRewrite: { '^/product/api': '/api' }
}));

app.use('/cart/api', createProxyMiddleware({
	...proxyOptions,
	target: process.env.CART_SERVICE_URL || 'http://localhost:3002',
	pathRewrite: { '^/cart/api': '/api' }
}));

app.use('/order/api', createProxyMiddleware({
	...proxyOptions,
	target: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
	pathRewrite: { '^/order/api': '/api' }
}));

app.use('/payment/api', createProxyMiddleware({
	...proxyOptions,
	target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
	pathRewrite: { '^/payment/api': '/api' }
}));

app.use('/ai-buddy', createProxyMiddleware({
	...proxyOptions,
	ws: true,
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

const path = require('path');
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('(.*)', (req, res) => {
	res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(process.env.PORT || 5000, () => {
	console.log(`API Gateway is running on port ${process.env.PORT || 5000}`);
});



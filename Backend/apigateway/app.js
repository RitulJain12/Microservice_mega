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

app.use(createProxyMiddleware({
	...proxyOptions,
	target: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
	pathFilter: '/user',
	pathRewrite: { '^/user': '' }
}));

app.use(createProxyMiddleware({
	...proxyOptions,
	target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
	pathFilter: '/product/api',
	pathRewrite: { '^/product/api': '/api' }
}));

app.use(createProxyMiddleware({
	...proxyOptions,
	target: process.env.CART_SERVICE_URL || 'http://localhost:3002',
	pathFilter: '/cart/api',
	pathRewrite: { '^/cart/api': '/api' }
}));

app.use(createProxyMiddleware({
	...proxyOptions,
	target: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
	pathFilter: '/order/api',
	pathRewrite: { '^/order/api': '/api' }
}));

app.use(createProxyMiddleware({
	...proxyOptions,
	target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
	pathFilter: '/payment/api',
	pathRewrite: { '^/payment/api': '/api' }
}));

app.use(createProxyMiddleware({
	...proxyOptions,
	ws: true,
	target: process.env.AIBUDDY_SERVICE_URL || 'http://localhost:3005',
	pathFilter: '/ai-buddy',
	pathRewrite: { '^/ai-buddy': '' }
}));

app.use(createProxyMiddleware({
	...proxyOptions,
	target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
	pathFilter: '/notification',
	pathRewrite: { '^/notification': '' }
}));

app.use(createProxyMiddleware({
	...proxyOptions,
	target: process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:3009',
	pathFilter: '/recommendations',
	pathRewrite: { '^/recommendations': '' }
}));

app.use(createProxyMiddleware({
	...proxyOptions,
	target: process.env.SELLER_SERVICE_URL || 'http://localhost:3008',
	pathFilter: '/seller',
	pathRewrite: { '^/seller': '' }
}));

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const path = require('path');
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*wildcard', (req, res) => {
	res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(process.env.PORT || 5000, () => {
	console.log(`API Gateway is running on port ${process.env.PORT || 5000}`);
});



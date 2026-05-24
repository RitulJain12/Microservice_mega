module.exports = {
  apps: [
    {
      name: 'auth',
      script: 'Server.js',
      cwd: './auth',
      watch: false,
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        MONGO_URL: process.env.AUTH_MONGO_URL
      }
    },
    {
      name: 'product',
      script: 'index.js',
      cwd: './Product-service',
      watch: false,
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
        MONGOURL: process.env.PRODUCT_MONGO_URL
      }
    },
    {
      name: 'cart',
      script: 'server.js',
      cwd: './Cart',
      watch: false,
      env: {
        PORT: 3002,
        NODE_ENV: 'production',
        MONGO_URL: process.env.CART_MONGO_URL
      }
    },
    {
      name: 'order',
      script: 'server.js',
      cwd: './order',
      watch: false,
      env: {
        PORT: 3003,
        NODE_ENV: 'production',
        MONGO_URL: process.env.ORDER_MONGO_URL
      }
    },
    {
      name: 'payment',
      script: 'server.js',
      cwd: './Payment',
      watch: false,
      env: {
        PORT: 3004,
        NODE_ENV: 'production',
        MONGO_URL: process.env.PAYMENT_MONGO_URL
      }
    },
    {
      name: 'notification',
      script: 'server.js',
      cwd: './Notification',
      watch: false,
      env: {
        PORT: 3006,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'recommendation',
      script: 'server.js',
      cwd: './Recommendation-service',
      watch: false,
      env: {
        PORT: 3009,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'seller',
      script: 'server.js',
      cwd: './Seller',
      watch: false,
      env: {
        PORT: 3008,
        NODE_ENV: 'production',
        MONGO_URL: process.env.SELLER_MONGO_URL
      }
    },
    {
      name: 'aibuddy',
      script: 'server.js',
      cwd: './Ai-buddy',
      watch: false,
      env: {
        PORT: 3005,
        NODE_ENV: 'production',
        MONGO_URL: process.env.AIBUDDY_MONGO_URL
      }
    },
    {
      name: 'apigateway',
      script: 'app.js',
      cwd: './apigateway',
      watch: false,
      env: {
        // Do NOT set PORT here so it inherits the system PORT (e.g. 10000) assigned by Render.
        NODE_ENV: 'production'
      }
    }
  ]
};

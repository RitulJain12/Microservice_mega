module.exports = {
  apps: [
    {
      name: 'auth',
      script: 'Server.js',
      cwd: './auth',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'product',
      script: 'index.js',
      cwd: './Product-service',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'cart',
      script: 'server.js',
      cwd: './Cart',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'order',
      script: 'server.js',
      cwd: './order',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'payment',
      script: 'server.js',
      cwd: './Payment',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'notification',
      script: 'server.js',
      cwd: './Notification',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'recommendation',
      script: 'server.js',
      cwd: './Recommendation-service',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'seller',
      script: 'server.js',
      cwd: './Seller',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'aibuddy',
      script: 'server.js',
      cwd: './Ai-buddy',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'apigateway',
      script: 'app.js',
      cwd: './apigateway',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};

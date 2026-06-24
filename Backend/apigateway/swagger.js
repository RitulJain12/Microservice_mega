const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mega Project API Gateway',
      version: '1.0.0',
      description: 'Centralized API documentation for the Mega Project microservices',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'API Gateway',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, './docs/*.yaml')], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

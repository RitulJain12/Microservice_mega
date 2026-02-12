const request = require('supertest');
const express = require('express');

/* ================= MOCK MIDDLEWARES ================= */

// auth middleware
jest.mock('../src/middlewares/auth.middleware', () => {
  return () => (req, res, next) => next();
});

// product middleware
jest.mock('../src/middlewares/product.middleware', () => {
  return (req, res, next) => next();
});

// multer / upload middleware
jest.mock('../src/middlewares/upload.middleware', () => ({
  array: () => (req, res, next) => next()
}));

/* ================= MOCK CONTROLLER ================= */

jest.mock('../src/controllers/product.controller', () => ({
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  getAllProducts: jest.fn()
}));

const ProductController = require('../src/controllers/product.controller');
const productRoutes = require('../src/routes/product.routes');

/* ================= TEST APP ================= */

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

/* ================= TEST CASES ================= */

describe('GET /api/products/:id', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('✅ should return product by id', async () => {
    const mockProduct = {
      _id: '123',
      name: 'MacBook Pro',
      price: 150000
    };

    ProductController.getProductById.mockImplementation((req, res) => {
      res.status(200).json({
        success: true,
        data: mockProduct
      });
    });

    const res = await request(app).get('/api/products/123');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockProduct);
    expect(ProductController.getProductById).toHaveBeenCalled();
  });

  it('❌ should return 404 if product not found', async () => {
    ProductController.getProductById.mockImplementation((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    });

    const res = await request(app).get('/api/products/999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Product not found');
  });

  it('💥 should handle server error', async () => {
    ProductController.getProductById.mockImplementation(() => {
      throw new Error('DB Error');
    });

    const res = await request(app).get('/api/products/123');

    expect(res.status).toBe(500);
  });
});

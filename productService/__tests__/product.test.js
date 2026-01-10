// Mock image upload service before importing app
const mockUpload = jest.fn().mockResolvedValue({ url: 'http://example.com/img.jpg', fileId: 'file123', thumbnailUrl: 'http://example.com/thumb.jpg' });
jest.mock('../src/service/imagekit.service.js', () => ({ uploadImage: mockUpload }));

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const productModel = require('../src/models/product.model');

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: 'test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  // clear database between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  mockUpload.mockClear();
});

function createAuthToken(role = 'seller', id) {
  const payload = { id: id || new mongoose.Types.ObjectId().toHexString(), role };
  return jwt.sign(payload, process.env.JWT_SECRET);
}

describe('Product API', () => {
  test('POST /api/product/ - create product', async () => {
    const token = createAuthToken('seller');

    const res = await request(app)
      .post('/api/product/')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Product')
      .field('description', 'A product for testing')
      .field('priceAmount', '123.45')
      .attach('images', Buffer.from('dummy'), 'test.jpg');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('product');
    const product = res.body.product;
    expect(product.title).toBe('Test Product');
    expect(product.description).toBe('A product for testing');
    expect(product.price.amount).toBeCloseTo(123.45);
    expect(product.images).toBeInstanceOf(Array);
    expect(product.images.length).toBeGreaterThanOrEqual(1);
    expect(mockUpload).toHaveBeenCalled();
  });

  test('GET /api/product/ - fetch products', async () => {
    const sellerId = new mongoose.Types.ObjectId();
    // create products directly
    await productModel.create([
      { title: 'P1', description: 'd1', price: { amount: 10, currency: 'INR' }, seller: sellerId },
      { title: 'P2', description: 'd2', price: { amount: 20, currency: 'INR' }, seller: sellerId }
    ]);

    const token = createAuthToken('seller', sellerId.toHexString());

    const res = await request(app)
      .get('/api/product/')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });
});
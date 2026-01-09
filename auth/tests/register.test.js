const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');

describe('POST /auth/register', () => {

  it('creates a user and returns 201 without password', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'john',
      email: 'john@example.com',
      password: 'secret',
      fullName: { firstName: 'John', lastName: 'Doe' }
    });

    expect(res.status).toBe(201);

    // ✅ FIX 1: id user ke andar hota hai
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user.username).toBe('john');
  });

  it('returns 400 for missing fields', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'noemail',
      password: 'x',
      fullName: { firstName: 'A', lastName: 'B' }
    });

    expect(res.status).toBe(400);
  });

  it('returns 409 for duplicate username or email', async () => {
    await User.create({
      username: 'jane',
      email: 'jane@example.com',
      password: 'x',
      fullName: { firstName: 'Jane', lastName: 'Doe' }
    });

    const res = await request(app).post('/auth/register').send({
      username: 'jane',
      email: 'jane2@example.com',
      password: 'secret',
      fullName: { firstName: 'Jane', lastName: 'Doe' }
    });

    // ✅ FIX 2: duplicate → 409 Conflict
    expect(res.status).toBe(409);

    const res2 = await request(app).post('/auth/register').send({
      username: 'jane2',
      email: 'jane@example.com',
      password: 'secret',
      fullName: { firstName: 'Jane', lastName: 'Doe' }
    });

    expect(res2.status).toBe(409);
  });

  it('stores a hashed password', async () => {
    const raw = 'mypassword';

    await request(app).post('/auth/register').send({
      username: 'hashuser',
      email: 'hash@example.com',
      password: raw,
      fullName: { firstName: 'Hash', lastName: 'User' }
    });

    // ✅ FIX 3: password select karna padega
    const user = await User
      .findOne({ username: 'hashuser' })
      .select('+password')
      .lean();

    expect(user).not.toBeNull();
    expect(user.password).toBeDefined();
    expect(user.password).not.toBe(raw);
  });

  it('creates a user and returns 201 without password', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'john',
      email: 'john@example.com',
      password: 'secret',
      fullName: { firstName: 'John', lastName: 'Doe' }
    });
  
    expect(res.status).toBe(201);
  
    // user object exist karta hai
    expect(res.body).toHaveProperty('user');
  
    // id present hai
    expect(res.body.user).toHaveProperty('id');
  
    // password response me nahi aana chahiye
    expect(res.body.user).not.toHaveProperty('password');
  
    // correct username
    expect(res.body.user.username).toBe('john');
  });
  

});

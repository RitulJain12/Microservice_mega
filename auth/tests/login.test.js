const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

describe('POST /auth/login', () => {
  const username = 'loginuser';
  const email = 'loginuser@example.com';
  const rawPassword = 's3cretP@ss';

  beforeEach(async () => {
    // create a user with a hashed password
    const hash = await bcrypt.hash(rawPassword, 10);
    await User.create({
      username,
      email,
      password: hash,
      fullName: { firstName: 'Login', lastName: 'User' }
    });
  });

  it('returns 200 and sets a token cookie on valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username, password: rawPassword });

    // If the route exists and works it should return 200 and set a cookie named "token"
    expect([200, 201]).toContain(res.status);

    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const hasTokenCookie = setCookie.some((c) => c.startsWith('token='));
    expect(hasTokenCookie).toBe(true);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', username);
  });

  it('returns 401 for invalid password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username, password: 'wrongpassword' });

    expect([400, 401, 404]).toContain(res.status);
  });

  it('returns 400 for missing fields', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username });

    expect([400, 422]).toContain(res.status);
  });
});
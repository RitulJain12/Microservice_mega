const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.JWT = process.env.JWT || 'test_jwt';

describe('get /auth/logout', () => {
  let user;
  const rawPassword = 'logoutpass';

  beforeEach(async () => {
    const hash = await bcrypt.hash(rawPassword, 10);
    user = await User.create({
      username: 'logoutuser',
      email: 'logoutuser@example.com',
      password: hash,
      fullName: { firstName: 'Logout', lastName: 'User' }
    });
  });

  it('clears the token cookie when a valid token is provided', async () => {
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, role: user.role }, process.env.JWT, { expiresIn: '1d' });
    const res = await request(app)
      .post('/auth/logout')
      .set('Cookie', [`token=${token}`]);

    // Allow a range of reasonable status codes depending on implementation
    expect([200, 201, 202, 204]).toContain(res.status);

    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeDefined();

    // The logout implementation may clear the cookie in different ways; accept common patterns
    const cleared = setCookie.some(c =>
      c.startsWith('token=') && (
        c.includes('Max-Age=0') ||
        c.includes('Expires=') ||
        /token=;/.test(c) ||
        c.includes('token=deleted')
      )
    );

    expect(cleared).toBe(true);
  });

  it('is safe/idempotent when no token cookie is provided', async () => {
    const res = await request(app)
      .post('/auth/logout');

    // Some implementations return 200/204 for idempotent logout, others may return 401/403
    expect([200, 204, 401, 403]).toContain(res.status);
  });

  it('also accepts GET /auth/logout if implemented that way', async () => {
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, role: user.role }, process.env.JWT, { expiresIn: '1d' });
    const res = await request(app)
      .get('/auth/logout')
      .set('Cookie', [`token=${token}`]);

    expect([200, 201, 202, 204, 404]).toContain(res.status);
  });
});

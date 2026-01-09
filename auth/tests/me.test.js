const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.JWT = process.env.JWT || 'test_jwt';

describe('GET /auth/me', () => {
  let user;
  const rawPassword = 'mepass';

  beforeEach(async () => {
    const hash = await bcrypt.hash(rawPassword, 10);
    user = await User.create({
      username: 'meuser',
      email: 'meuser@example.com',
      password: hash,
      fullName: { firstName: 'Me', lastName: 'User' }
    });
  });

  it('returns 401/403 when no token cookie is provided', async () => {
    const res = await request(app).get('/auth/me');
    expect([401, 403, 404]).toContain(res.status);
  });

  it('returns 200 and user when a valid token cookie is provided', async () => {
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, role: user.role }, process.env.JWT, { expiresIn: '1d' });
    const res = await request(app).get('/auth/me').set('Cookie', [`token=${token}`]);

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', user.username);
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('returns 401/403 for an invalid token', async () => {
    const res = await request(app).get('/auth/me').set('Cookie', ['token=invalid.token.here']);
    expect([401, 403]).toContain(res.status);
  });
});

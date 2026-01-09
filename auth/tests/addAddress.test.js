const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.JWT = process.env.JWT || 'test_jwt';

describe('POST /auth/users/me/addresses', () => {
  let user;
  const rawPassword = 'addrpass';

  beforeEach(async () => {
    const hash = await bcrypt.hash(rawPassword, 10);
    user = await User.create({
      username: 'addruser',
      email: 'addruser@example.com',
      password: hash,
      fullName: { firstName: 'Addr', lastName: 'User' }
    });
  });

  it('adds an address and returns 201 with addresses array', async () => {
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, role: user.role }, process.env.JWT, { expiresIn: '1d' });

    const address = {
      street: '123 Test St',
      city: 'Testville',
      state: 'TS',
      zip: '12345',
      country: 'Testland'
    };

    const res = await request(app)
      .post('/auth/users/me/addresses')
      .set('Cookie', [`token=${token}`])
      .send(address);

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('addresses');
    expect(Array.isArray(res.body.addresses)).toBe(true);
    expect(res.body.addresses.length).toBeGreaterThanOrEqual(1);
    const added = res.body.addresses.find(a => a.street === address.street && a.city === address.city);
    expect(added).toBeDefined();

    // verify persisted in DB
    const fresh = await User.findById(user._id).lean();
    expect(fresh.addresses.length).toBeGreaterThanOrEqual(1);
    expect(fresh.addresses.some(a => a.street === address.street)).toBe(true);
  });

  it('returns 400 for invalid address data', async () => {
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, role: user.role }, process.env.JWT, { expiresIn: '1d' });

    const res = await request(app)
      .post('/auth/users/me/addresses')
      .set('Cookie', [`token=${token}`])
      .send({ city: 'NoStreet' });

    expect([400, 422]).toContain(res.status);
  });

  it('returns 401/403 when no token cookie is provided', async () => {
    const res = await request(app)
      .post('/auth/users/me/addresses')
      .send({ street: '1', city: 'X', country: 'Y' });

    expect([401, 403]).toContain(res.status);
  });
});
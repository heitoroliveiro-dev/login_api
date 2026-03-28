const request = require('supertest');
const bcrypt = require('bcrypt');

jest.mock('../src/models/User', () => {
  const model = {
    findOne: jest.fn(),
    create: jest.fn(),
    schema: {
      path: jest.fn(() => ({
        options: {
          match: [/^\S+@\S+\.\S+$/]
        }
      }))
    }
  };

  return model;
});

const User = require('../src/models/User');
const app = require('../src/app');

describe('Auth edge cases', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 409 when trying to register with duplicate email', async () => {
    User.findOne.mockResolvedValue({ _id: 'u1', email: 'existing@mail.com' });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Heitor',
        email: 'existing@mail.com',
        password: '123456'
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already registered.');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('returns 401 when login password is invalid', async () => {
    const hash = await bcrypt.hash('correct123', 10);

    User.findOne.mockResolvedValue({
      _id: 'u2',
      email: 'heitor@mail.com',
      password: hash,
      name: 'Heitor'
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'heitor@mail.com',
        password: 'wrong123'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials.');
  });

  it('returns 401 when token is invalid on protected endpoint', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.value');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid or expired token.');
  });
});

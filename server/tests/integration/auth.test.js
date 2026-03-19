const request = require('supertest');
const app = require('../../index');
const prisma = require('../../utils/db');

describe('Auth Integration Tests (API + DB)', () => {
  const testUser = {
    name: 'Integration Test User',
    email: 'integration_test@example.com',
    password: 'password123',
  };

  // ── Cleanup BEFORE and AFTER tests ──────────────────────────────────────────
  const cleanup = async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
  };

  beforeAll(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  // ── Registration Test ──────────────────────────────────────────────────────
  describe('POST /api/auth/register', () => {
    it('should register a new user and store it in the database', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe(testUser.email);

      // Verify user exists in the actual DB
      const userInDb = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(userInDb).not.toBeNull();
      expect(userInDb.name).toBe(testUser.name);
    });

    it('should return 400 if the user already exists', async () => {
      // First one already created in the previous test
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.message).toBe('User already exists');
    });
  });

  // ── Login Test ─────────────────────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('should log in an existing user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe(testUser.email);
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrong_password',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});

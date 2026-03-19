const request = require('supertest');
const app = require('../../index');
const prisma = require('../../utils/db');
const jwt = require('jsonwebtoken');

jest.setTimeout(15000);

describe('Request Integration Tests (API + DB)', () => {
  let authToken;
  let testUser;
  let createdRequestId;

  beforeAll(async () => {
    // 1. Setup a test user and get a token
    testUser = await prisma.user.upsert({
      where: { email: 'request_tester@example.com' },
      update: {},
      create: {
        name: 'Request Tester',
        email: 'request_tester@example.com',
        password: 'hashed-password-not-important-here',
      },
    });

    authToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    // Cleanup
    if (createdRequestId) {
      await prisma.offer.deleteMany({ where: { requestId: createdRequestId } });
      await prisma.request.delete({ where: { id: createdRequestId } });
    }
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } });
    }
    await prisma.$disconnect();
  });

  describe('POST /api/requests', () => {
    it('should create a new request in the database', async () => {
      const newRequest = {
        title: 'Need a custom logo design',
        description: 'I need a minimalist logo for my new e-commerce project.',
        category: 'Design & Creative',
        budgetRange: '100-500',
        urgency: 'urgent',
      };

      const response = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newRequest)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newRequest.title);
      createdRequestId = response.body.id;

      // Verify in DB
      const requestInDb = await prisma.request.findUnique({
        where: { id: createdRequestId },
      });
      expect(requestInDb).not.toBeNull();
      expect(requestInDb.buyerId).toBe(testUser.id);
      expect(requestInDb.category).toBe(newRequest.category);
    });

    it('should return 401 if no token is provided', async () => {
      await request(app)
        .post('/api/requests')
        .send({ title: 'Test' })
        .expect(401);
    });
  });

  describe('GET /api/requests', () => {
    it('should fetch all requests including the newly created one', async () => {
      const response = await request(app)
        .get('/api/requests')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const found = response.body.find(r => r.id === createdRequestId);
      expect(found).toBeDefined();
      expect(found.title).toBe('Need a custom logo design');
    });
  });
});

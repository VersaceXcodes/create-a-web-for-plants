import request from 'supertest';
import { app, pool } from './server.ts'; // Your Express app instance and database pool
import { seedDatabase, clearDatabase } from './test-helpers'; // Helper functions for DB setup

beforeAll(async () => {
  await seedDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await pool.end();
});

describe('User Authentication', () => {
  describe('POST /auth/register', () => {
    test('should register a new user and return an auth token', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: "test@example.com", name: "Test User" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('auth_token');
    });

    test('should fail with existing email', async () => {
      await request(app)
        .post('/auth/register')
        .send({ email: "alice@example.com", name: "Duplicate User" });
      const response = await request(app)
        .post('/auth/register')
        .send({ email: "alice@example.com", name: "Test User" });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    test('should login a user and return an auth token', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: "alice@example.com", password: "password123" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('auth_token');
    });

    test('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: "alice@example.com", password: "wrongpassword" });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});

describe('Plant Management', () => {
  describe('GET /plants', () => {
    test('should retrieve a list of plants', async () => {
      const response = await request(app).get('/plants');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /plants/:plant_id', () => {
    test('should retrieve a specific plant detail', async () => {
      const response = await request(app).get('/plants/plant1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('common_name', 'Fiddle Leaf Fig');
    });

    test('should return 404 for non-existent plant', async () => {
      const response = await request(app).get('/plants/nonexistent');
      expect(response.statusCode).toBe(404);
    });
  });
});

describe('Forum Interactions', () => {
  describe('GET /forum', () => {
    test('should retrieve all forum posts', async () => {
      const response = await request(app).get('/forum');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /forum', () => {
    test('should allow logged-in users to create a forum post', async () => {
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({ email: 'bob@example.com', password: 'password123' });

      const response = await request(app)
        .post('/forum')
        .set('Authorization', `Bearer ${loginResponse.body.auth_token}`)
        .send({ user_id: 'user2', content: 'New Forum Post', topic: 'New Topic' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('content', 'New Forum Post');
    });
  });
});

describe('Marketplace Listings', () => {
  describe('GET /marketplace', () => {
    test('should retrieve all marketplace listings', async () => {
      const response = await request(app).get('/marketplace');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /marketplace', () => {
    test('should allow logged-in users to create a marketplace listing', async () => {
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({ email: 'bob@example.com', password: 'password123' });

      const response = await request(app)
        .post('/marketplace')
        .set('Authorization', `Bearer ${loginResponse.body.auth_token}`)
        .send({
          user_id: 'user2',
          plant_id: 'plant2',
          condition: 'Excellent',
          desired_trade: 'Open to offers',
          status: 'Available'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('condition', 'Excellent');
    });
  });
});
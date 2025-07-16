jest.mock('openai', () => ({
  __esModule: true,
  default: class {
    chat = {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'This is a test summary.' } }],
        }),
      },
    };
  },
}));

jest.mock('firebase-admin', () => ({
  apps: [{}],
  credential: { cert: jest.fn() },
  initializeApp: jest.fn(),
  auth: () => ({
    verifyIdToken: jest.fn(async (token: string) => {
      if (token === 'valid-token') return { uid: 'mock-user-id' };
      throw new Error('Invalid token');
    }),
  }),
}));

import request from 'supertest';
import app from '../src/testApp';

describe('Auth Middleware', () => {
  it('should reject request with no Authorization header', async () => {
    const res = await request(app).get('/incidents');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized: Missing or invalid authorization header' });
  });

  it('should reject request with invalid token', async () => {
    const res = await request(app)
      .get('/incidents')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized: Invalid token' });
  });

  it('should allow request with valid token', async () => {
    const res = await request(app)
      .get('/incidents')
      .set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(200);
  });
});

import request from 'supertest';
import app from '../src/testApp';

// --- MOCK OpenAI ---
jest.mock('openai', () => ({
  __esModule: true,
  default: class {
    chat = {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            { message: { content: 'This is a test summary.' } }
          ]
        }),
      },
    };
  },
}));

// --- MOCK Firebase Admin ---
jest.mock('firebase-admin', () => ({
  apps: [{}],
  credential: {
    cert: jest.fn(),
  },
  initializeApp: jest.fn(),
  auth: () => ({
    verifyIdToken: jest.fn((token) => {
      if (token === 'valid-token') {
        return Promise.resolve({ uid: 'mock-user-id' });
      }
      return Promise.reject(new Error('Invalid token'));
    }),
  }),
}));

describe('Auth Middleware', () => {
  it('should reject request with no Authorization header', async () => {
    const res = await request(app).get('/incidents');
    expect(res.status).toBe(401);
    expect(res.text).toBe('Unauthorized');
  });

  it('should reject request with invalid token', async () => {
    const res = await request(app)
      .get('/incidents')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
    expect(res.text).toBe('Invalid token');
  });

  it('should allow request with valid token', async () => {
    const res = await request(app)
      .get('/incidents')
      .set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(200);
  });
});

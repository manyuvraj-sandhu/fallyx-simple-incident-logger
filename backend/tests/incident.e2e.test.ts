jest.mock('firebase-admin', () => ({
  apps: [{}],
  credential: { cert: jest.fn() },
  initializeApp: jest.fn(),
  auth: () => ({
    verifyIdToken: jest.fn(async (token: string) => {
      if (token === 'valid-token-user-1') return { uid: 'user-1' };
      if (token === 'valid-token-user-2') return { uid: 'user-2' };
      return Promise.reject(new Error('Invalid token'));
    }),
  }),
}));

jest.mock('openai', () => ({
  __esModule: true,
  default: class {
    chat = {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'E2E Summary Test' } }],
        }),
      },
    };
  },
}));

import request from 'supertest';
import app from '../src/testApp';
import { User } from '../src/models';

describe('Incident E2E Tests', () => {
  const user1Id = 'user-1';
  const user2Id = 'user-2';
  const user1Token = 'valid-token-user-1';
  const user2Token = 'valid-token-user-2';

  beforeAll(async () => {
    await User.bulkCreate([
      { id: user1Id, displayName: 'User One' },
      { id: user2Id, displayName: 'User Two' },
    ]);
  });

  let incidentIdUser1: string;

  it('should create an incident (valid)', async () => {
    const res = await request(app)
      .post('/incidents')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ type: 'fall', description: 'Patient slipped' });

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('fall');
    incidentIdUser1 = res.body.id;
  });

  it('should reject creating an incident with invalid data (missing fields)', async () => {
    const res = await request(app)
      .post('/incidents')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ description: 'Missing type field' }); // missing 'type'

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should fetch all user1 incidents', async () => {
    const res = await request(app)
      .get('/incidents')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch empty list for user2 (no incidents)', async () => {
    const res = await request(app)
      .get('/incidents')
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should prevent user2 from updating user1’s incident', async () => {
    const res = await request(app)
      .put(`/incidents/${incidentIdUser1}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ type: 'behaviour', description: 'Trying to update unauthorized' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  it('should allow user1 to update their incident', async () => {
    const res = await request(app)
      .put(`/incidents/${incidentIdUser1}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ type: 'behaviour', description: 'Updated description' });

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('behaviour');
  });

  it('should prevent user2 from deleting user1’s incident', async () => {
    const res = await request(app)
      .delete(`/incidents/${incidentIdUser1}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  it('should allow user1 to delete their incident', async () => {
    const res = await request(app)
      .delete(`/incidents/${incidentIdUser1}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
  });

  it('should block summarize with invalid/expired token', async () => {
    const res = await request(app)
      .post(`/incidents/some-id/summarize`)
      .set('Authorization', `Bearer invalid-token`);

    expect(res.status).toBe(401);
  });

  it('should handle full user flow', async () => {
    const createRes = await request(app)
      .post('/incidents')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ type: 'fall', description: 'Full flow test incident' });

    expect(createRes.status).toBe(200);
    const incidentId = createRes.body.id;

    const sumRes = await request(app)
      .post(`/incidents/${incidentId}/summarize`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(sumRes.status).toBe(200);
    expect(sumRes.body.summary).toBe('E2E Summary Test');

    const updateRes = await request(app)
      .put(`/incidents/${incidentId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ type: 'medication', description: 'Updated full flow' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.type).toBe('medication');

    const deleteRes = await request(app)
      .delete(`/incidents/${incidentId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(deleteRes.status).toBe(200);
  });
});

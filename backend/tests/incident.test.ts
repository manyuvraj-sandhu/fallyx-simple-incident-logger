// Always mock BEFORE importing app
jest.mock('firebase-admin', () => {
    return {
      initializeApp: jest.fn(),
      credential: {
        cert: jest.fn(),
      },
      apps: [{}], // simulate an initialized app
      auth: () => ({
        verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-123' }),
      }),
    };
  });
  
  jest.mock('openai', () => {
    return {
      __esModule: true,
      default: class {
        chat = {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: 'This is a test summary.',
                  },
                },
              ],
            }),
          },
        };
      },
    };
  });
  
  import request from 'supertest';
  import app from '../src/testApp';
  
  describe('Incident Routes', () => {
    const testToken = 'test.jwt.token';
  
    it('creates a new incident', async () => {
      const res = await request(app)
        .post('/incidents')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ type: 'fall', description: 'Patient slipped in hallway.' });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('type', 'fall');
    });
  
    it('summarizes an incident', async () => {
      const createRes = await request(app)
        .post('/incidents')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ type: 'medication', description: 'Wrong dose given' });
  
      const id = createRes.body.id;
  
      const summarizeRes = await request(app)
        .post(`/incidents/${id}/summarize`)
        .set('Authorization', `Bearer ${testToken}`);
  
      expect(summarizeRes.statusCode).toBe(200);
      expect(summarizeRes.body).toHaveProperty('summary', 'This is a test summary.');
    });
  
    it('deletes an incident', async () => {
      const createRes = await request(app)
        .post('/incidents')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ type: 'behaviour', description: 'Aggressive action reported' });
  
      const id = createRes.body.id;
  
      const deleteRes = await request(app)
        .delete(`/incidents/${id}`)
        .set('Authorization', `Bearer ${testToken}`);
  
      expect(deleteRes.statusCode).toBe(200);
    });
  });
  
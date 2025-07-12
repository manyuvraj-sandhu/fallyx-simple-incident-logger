const verifyIdToken = jest.fn().mockResolvedValue({ uid: 'test-user-123' });

module.exports = {
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  apps: [{}], // fake an initialized app
  auth: () => ({
    verifyIdToken,
  }),
};

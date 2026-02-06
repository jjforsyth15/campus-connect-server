import request from 'supertest';
import app from '../../../index';

describe('Event Routes', () => {
  describe('POST /api/v1/events', () => {
    it('rejects event creation without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/events')
        .send({
          title: 'Test Event',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3600000).toISOString(),
        });

      expect(response.status).toBe(401);
    });

    it('rejects event creation with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/events')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          title: 'Test Event',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3600000).toISOString(),
        });

      expect(response.status).toBe(401);
    });

    it('rejects event with missing title', async () => {
      // This would need a valid test user token
      // Skip for now until proper test setup
    });
  });
});
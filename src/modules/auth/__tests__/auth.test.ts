import request from 'supertest'
import app from '../../../index'

describe('Auth Routes', () => {
  
  describe('POST /api/v1/users/register', () => {
    it('rejects registration without email', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          password: 'Password123',
          firstName: 'Test',
          lastName: 'User'
        })

      expect(response.status).toBe(400)
    })

    it('rejects registration with non-CSUN email', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: 'test@gmail.com',
          password: 'Password123',
          firstName: 'Test',
          lastName: 'User'
        })

      expect(response.status).toBe(400)
    })

    it('rejects registration with short password', async () => {
      const response = await request(app)
        .post('/api/v1/users/register')
        .send({
          email: 'test@my.csun.edu',
          password: '123',
          firstName: 'Test',
          lastName: 'User'
        })

      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/v1/users/login', () => {
    it('rejects login without email', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          password: 'Password123'
        })

      expect(response.status).toBe(400)
    })

    it('rejects login without password', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test@my.csun.edu'
        })

      expect(response.status).toBe(400)
    })

    it('rejects login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'nonexistent@my.csun.edu',
          password: 'WrongPassword123'
        })

      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/v1/users/me', () => {
    it('rejects request without auth token', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')

      expect(response.status).toBe(401)
    })

    it('rejects request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer invalid-token')

      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/v1/users/request-password-reset', () => {
    it('accepts valid CSUN email', async () => {
      const response = await request(app)
        .post('/api/v1/users/request-password-reset')
        .send({ email: 'test@my.csun.edu' })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })

    it('rejects non-CSUN email', async () => {
      const response = await request(app)
        .post('/api/v1/users/request-password-reset')
        .send({ email: 'test@gmail.com' })

      expect(response.status).toBe(400)
    })

    it('rejects missing email', async () => {
      const response = await request(app)
        .post('/api/v1/users/request-password-reset')
        .send({})

      expect(response.status).toBe(400)
    })

    it('rejects invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/users/request-password-reset')
        .send({ email: 'not-an-email' })

      expect(response.status).toBe(400)
    })

    it('returns success for non-existent email (security)', async () => {
      const response = await request(app)
        .post('/api/v1/users/request-password-reset')
        .send({ email: 'nonexistent@my.csun.edu' })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })

  describe('POST /api/v1/users/reset-password', () => {
    it('rejects missing token', async () => {
      const response = await request(app)
        .post('/api/v1/users/reset-password')
        .send({ password: 'NewPassword123!' })

      expect(response.status).toBe(400)
    })

    it('rejects missing password', async () => {
      const response = await request(app)
        .post('/api/v1/users/reset-password')
        .send({ token: 'a'.repeat(64) })

      expect(response.status).toBe(400)
    })

    it('rejects weak password (too short)', async () => {
      const response = await request(app)
        .post('/api/v1/users/reset-password')
        .send({
          token: 'a'.repeat(64),
          password: 'Short1!'
        })

      expect(response.status).toBe(400)
    })

    it('rejects password without uppercase', async () => {
      const response = await request(app)
        .post('/api/v1/users/reset-password')
        .send({
          token: 'a'.repeat(64),
          password: 'password123!'
        })

      expect(response.status).toBe(400)
    })

    it('rejects password without lowercase', async () => {
      const response = await request(app)
        .post('/api/v1/users/reset-password')
        .send({
          token: 'a'.repeat(64),
          password: 'PASSWORD123!'
        })

      expect(response.status).toBe(400)
    })

    it('rejects password without number', async () => {
      const response = await request(app)
        .post('/api/v1/users/reset-password')
        .send({
          token: 'a'.repeat(64),
          password: 'Password!'
        })

      expect(response.status).toBe(400)
    })

    it('rejects password without special character', async () => {
      const response = await request(app)
        .post('/api/v1/users/reset-password')
        .send({
          token: 'a'.repeat(64),
          password: 'Password123'
        })

      expect(response.status).toBe(400)
    })

    it('rejects invalid token format', async () => {
      const response = await request(app)
        .post('/api/v1/users/reset-password')
        .send({
          token: 'short-token',
          password: 'NewPassword123!'
        })

      expect(response.status).toBe(400)
    })

    it('rejects expired/invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/users/reset-password')
        .send({
          token: 'a'.repeat(64),
          password: 'NewPassword123!'
        })

      expect(response.status).toBe(400)
    })
  })
})
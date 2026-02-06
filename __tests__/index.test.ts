import request from 'supertest'
import app from '../src/index'

describe('API Server', () => {
  it('GET / returns welcome message', async () => {
    const response = await request(app).get('/')
    
    expect(response.status).toBe(200)
    expect(response.body.message).toBeDefined()
  })

  it('GET /api/v1/users returns response', async () => {
    const response = await request(app).get('/api/v1/users')
    
    // Just check it's not 500 (server error)
    expect(response.status).toBeLessThan(500)
  })

  it('GET /nonexistent returns 404', async () => {
    const response = await request(app).get('/nonexistent')
    
    expect(response.status).toBe(404)
  })
})
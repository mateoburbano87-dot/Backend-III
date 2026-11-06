import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Logger API', () => {
  it('GET /api/logger-test devuelve 200 con la lista de niveles', async () => {
    const res = await request(app).get('/api/logger-test');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.keys('message', 'levels');
    expect(res.body.levels).to.deep.equal([
      'debug',
      'http',
      'info',
      'warning',
      'error',
      'fatal',
    ]);
  });
});
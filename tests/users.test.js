import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';

test('POST /api/users sin email devuelve 400', async () => {
  const res = await request(app)
    .post('/api/users')
    .send({ name: 'Test' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
});

test('GET /api/users/:id con id inválido devuelve 400', async () => {
  const res = await request(app).get('/api/users/xyz');
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
});
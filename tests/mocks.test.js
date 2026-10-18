import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';

test('GET /api/mocks/users?qty=-1 devuelve 400', async () => {
  const res = await request(app).get('/api/mocks/users?qty=-1');
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
});

test('GET /api/mocks/users?qty=abc devuelve 400', async () => {
  const res = await request(app).get('/api/mocks/users?qty=abc');
  assert.strictEqual(res.status, 400);
});

test('POST /api/mocks/seed/peliculas devuelve 400', async () => {
  const res = await request(app).post('/api/mocks/seed/peliculas?qty=2');
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error.code, 'BAD_REQUEST');
});
import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';

test('GET /api/logger-test devuelve 200 y lista los niveles', async () => {
  const res = await request(app).get('/api/logger-test');
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body.levels));
  assert.deepStrictEqual(res.body.levels, [
    'debug',
    'http',
    'info',
    'warning',
    'error',
    'fatal',
  ]);
});
import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';

// Test simple de integración: no conecto a Mongo, solo pruebo
// que el endpoint responda con el código esperado en casos borde.

test('GET /api/products/:id con id inválido devuelve 400', async () => {
  const res = await request(app).get('/api/products/id-que-no-es-valido');
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
});

test('POST /api/products sin name devuelve 400', async () => {
  const res = await request(app)
    .post('/api/products')
    .send({ price: 100 });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
});

test('Ruta inexistente devuelve 404 con estructura uniforme', async () => {
  const res = await request(app).get('/api/no-existe');
  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.error.code, 'ROUTE_NOT_FOUND');
});
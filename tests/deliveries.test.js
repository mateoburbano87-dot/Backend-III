import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB, cleanDB } from './helpers/setup.js';

describe('Deliveries API', () => {
  before(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await cleanDB();
  });

  after(async () => {
    await disconnectDB();
  });

  it('GET /api/deliveries devuelve 200 y array vacío', async () => {
    const res = await request(app).get('/api/deliveries');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.is.empty;
  });

  it('GET /api/deliveries/:id devuelve 404 si no existe', async () => {
    const res = await request(app).get('/api/deliveries/000000000000000000000000');
    expect(res.status).to.equal(404);
    expect(res.body.error.code).to.equal('NOT_FOUND');
  });

  it('GET /api/deliveries/:id devuelve 400 si el id es inválido', async () => {
    const res = await request(app).get('/api/deliveries/xxx');
    expect(res.status).to.equal(400);
    expect(res.body.error.code).to.equal('VALIDATION_ERROR');
  });
});
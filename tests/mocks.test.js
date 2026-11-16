import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB, cleanDB } from './helpers/setup.js';

describe('Mocks API', () => {
  before(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await cleanDB();
  });

  after(async () => {
    await disconnectDB();
  });

  describe('GET /api/mocks/users', () => {
    it('genera la cantidad pedida sin guardar en Mongo', async () => {
      const res = await request(app).get('/api/mocks/users?qty=3');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(3);
      expect(res.body[0]).to.include.keys('name', 'email', 'role');
    });

    it('devuelve 400 si qty es negativo', async () => {
      const res = await request(app).get('/api/mocks/users?qty=-1');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('devuelve 400 si qty no es numérico', async () => {
      const res = await request(app).get('/api/mocks/users?qty=abc');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('devuelve 400 si qty supera el máximo', async () => {
      const res = await request(app).get('/api/mocks/users?qty=999');
      expect(res.status).to.equal(400);
    });
  });

  describe('GET /api/mocks/orders', () => {
    it('genera la cantidad pedida', async () => {
      const res = await request(app).get('/api/mocks/orders?qty=2');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(2);
      expect(res.body[0]).to.include.keys('status', 'priority');
    });
  });

  describe('POST /api/mocks/seed/users', () => {
    it('inserta usuarios reales en Mongo', async () => {
      const res = await request(app).post('/api/mocks/seed/users?qty=5');
      expect(res.status).to.equal(201);
      expect(res.body).to.have.keys('insertados', 'coleccion');
      expect(res.body.insertados).to.equal(5);
      expect(res.body.coleccion).to.equal('users');
    });
  });

  describe('POST /api/mocks/seed/:collection', () => {
    it('devuelve 400 si la colección no es válida', async () => {
      const res = await request(app).post('/api/mocks/seed/inventada?qty=3');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('BAD_REQUEST');
    });

    it('devuelve 400 si qty es inválido', async () => {
      const res = await request(app).post('/api/mocks/seed/users?qty=0');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });
  });
});
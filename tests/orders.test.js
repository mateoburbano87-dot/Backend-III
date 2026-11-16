import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB, cleanDB } from './helpers/setup.js';
import { UserModel } from '../src/models/user.model.js';
import { OrderModel } from '../src/models/order.model.js';

describe('Orders API', () => {
  before(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await cleanDB();
  });

  after(async () => {
    await disconnectDB();
  });

  // Helper: crea un usuario válido para usar en los tests de pedidos
  const createTestUser = async () => {
    return UserModel.create({
      name: 'Cliente Test',
      email: 'cliente@test.com',
      role: 'CLIENTE',
    });
  };

  describe('GET /api/orders', () => {
    it('devuelve 200 y un array vacío si no hay pedidos', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });
  });

  describe('POST /api/orders', () => {
    it('crea un pedido con datos válidos y devuelve 201', async () => {
      const user = await createTestUser();
      const res = await request(app).post('/api/orders').send({
        user: user._id.toString(),
        products: [],
      });
      expect(res.status).to.equal(201);
      expect(res.body).to.include.keys('_id', 'user', 'status', 'priority');
      expect(res.body.status).to.equal('PENDING');
      expect(res.body.priority).to.equal('MEDIUM');
    });

    it('devuelve 400 si falta el campo user', async () => {
      const res = await request(app).post('/api/orders').send({});
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('devuelve 400 si el usuario indicado no existe', async () => {
      const res = await request(app).post('/api/orders').send({
        user: '000000000000000000000000',
      });
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });
  });

  describe('GET /api/orders/:id', () => {
    it('devuelve 400 si el id es inválido', async () => {
      const res = await request(app).get('/api/orders/xxx');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('devuelve 404 si el pedido no existe', async () => {
      const res = await request(app).get('/api/orders/000000000000000000000000');
      expect(res.status).to.equal(404);
      expect(res.body.error.code).to.equal('NOT_FOUND');
    });

    it('devuelve el pedido si existe', async () => {
      const user = await createTestUser();
      const order = await OrderModel.create({
        user: user._id,
        status: 'PENDING',
        priority: 'MEDIUM',
      });
      const res = await request(app).get(`/api/orders/${order._id}`);
      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(order._id.toString());
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('actualiza el estado a un valor válido', async () => {
      const user = await createTestUser();
      const order = await OrderModel.create({ user: user._id });

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: 'IN_PROGRESS' });

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('IN_PROGRESS');
    });

    it('devuelve 400 si el estado es inválido', async () => {
      const user = await createTestUser();
      const order = await OrderModel.create({ user: user._id });

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: 'ESTADO_QUE_NO_EXISTE' });

      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('devuelve 404 si el pedido no existe', async () => {
      const res = await request(app)
        .patch('/api/orders/000000000000000000000000/status')
        .send({ status: 'DELIVERED' });

      expect(res.status).to.equal(404);
      expect(res.body.error.code).to.equal('NOT_FOUND');
    });
  });
});
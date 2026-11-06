import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB, cleanDB } from './helpers/setup.js';
import { UserModel } from '../src/models/user.model.js';

describe('Users API', () => {
  before(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await cleanDB();
  });

  after(async () => {
    await disconnectDB();
  });

  describe('GET /api/users', () => {
    it('devuelve 200 y un array (vacío si no hay usuarios)', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });

    it('devuelve los usuarios creados con sus propiedades principales', async () => {
      await UserModel.create({
        name: 'Ana Test',
        email: 'ana@test.com',
        role: 'CLIENTE',
      });

      const res = await request(app).get('/api/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.include.keys('_id', 'name', 'email', 'role');
      expect(res.body[0].email).to.equal('ana@test.com');
      // El password no debe venir
      expect(res.body[0]).to.not.have.property('password');
    });
  });

  describe('GET /api/users/:id', () => {
    it('devuelve 400 si el id es inválido', async () => {
      const res = await request(app).get('/api/users/id-invalido');
      expect(res.status).to.equal(400);
      expect(res.body).to.deep.include({ success: false });
      expect(res.body.error).to.include.keys('code', 'message');
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('devuelve 404 si el id es válido pero no existe', async () => {
      const fakeId = '000000000000000000000000';
      const res = await request(app).get(`/api/users/${fakeId}`);
      expect(res.status).to.equal(404);
      expect(res.body.error.code).to.equal('NOT_FOUND');
      expect(res.body.error.message).to.equal('Usuario no encontrado');
    });
  });

  describe('POST /api/users', () => {
    it('crea un usuario y devuelve 201 con la estructura esperada', async () => {
      const res = await request(app).post('/api/users').send({
        name: 'Luis Test',
        email: 'luis@test.com',
      });
      expect(res.status).to.equal(201);
      expect(res.body).to.include.keys('_id', 'name', 'email', 'role');
      expect(res.body.role).to.equal('USER');
    });

    it('devuelve 400 si falta el email', async () => {
      const res = await request(app).post('/api/users').send({ name: 'Sin email' });
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('devuelve 409 si el email ya existe', async () => {
      await UserModel.create({
        name: 'Repetido',
        email: 'dup@test.com',
      });
      const res = await request(app).post('/api/users').send({
        name: 'Otro',
        email: 'dup@test.com',
      });
      expect(res.status).to.equal(409);
      expect(res.body.error.code).to.equal('CONFLICT');
    });
  });
});
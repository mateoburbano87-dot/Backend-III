import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../src/app.js';
import { UserModel } from '../src/models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const validFilePath = path.join(__dirname, 'fixtures/valid.pdf');
const invalidTypePath = path.join(__dirname, 'fixtures/invalid.txt');
const largeFilePath = path.join(__dirname, 'fixtures/large.pdf');

describe('Files API', () => {
  let testUserId;

  before(async () => {
    // Creo archivos de prueba
    await fs.mkdir(path.join(__dirname, 'fixtures'), { recursive: true });

    // PDF chico válido
    await fs.writeFile(validFilePath, '%PDF-1.4\n%fake pdf content');

    // Archivo con tipo no permitido
    await fs.writeFile(invalidTypePath, 'esto es un txt, no permitido');

    // Archivo "grande" (6 MB) para probar límite de tamaño
    const bigBuffer = Buffer.alloc(6 * 1024 * 1024, 'a');
    await fs.writeFile(largeFilePath, bigBuffer);

    // Usuario de prueba
    const user = await UserModel.create({
      name: 'File Test User',
      email: `file-test-${Date.now()}@test.com`,
      role: 'USER',
    });
    testUserId = user._id.toString();
  });

  after(async () => {
    // Limpio archivos y usuario
    await fs.unlink(validFilePath).catch(() => {});
    await fs.unlink(invalidTypePath).catch(() => {});
    await fs.unlink(largeFilePath).catch(() => {});
    await UserModel.findByIdAndDelete(testUserId);
  });

  it('debería subir un documento de usuario correctamente', async () => {
    const res = await request(app)
      .post(`/api/files/users/${testUserId}/document`)
      .attach('document', validFilePath)
      .field('documentType', 'DNI')
      .expect(201);

    expect(res.body.success).to.be.true;
    expect(res.body.data.user.documents).to.be.an('array');
    expect(res.body.data.user.documents[0]).to.have.property('documentType', 'DNI');
    expect(res.body.data.user.documents[0]).to.have.property('originalName');
    expect(res.body.data.user.documents[0]).to.have.property('size');
  });

  it('debería devolver error si falta el archivo', async () => {
    const res = await request(app)
      .post(`/api/files/users/${testUserId}/document`)
      .field('documentType', 'DNI')
      .expect(400);

    expect(res.body.success).to.be.false;
    expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    expect(res.body.error.message).to.include('archivo');
  });

  it('debería devolver error si el tipo de archivo no está permitido', async () => {
    const res = await request(app)
      .post(`/api/files/users/${testUserId}/document`)
      .attach('document', invalidTypePath)
      .expect(400);

    expect(res.body.success).to.be.false;
    expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    expect(res.body.error.message).to.include('Tipo de archivo');
  });

  it('debería devolver error si el archivo supera el tamaño máximo', async () => {
    const res = await request(app)
      .post(`/api/files/users/${testUserId}/document`)
      .attach('document', largeFilePath)
      .expect(400);

    expect(res.body.success).to.be.false;
    expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    expect(res.body.error.message).to.include('tamaño');
  });

  it('debería devolver error si el tipo de documento es inválido', async () => {
    const res = await request(app)
      .post(`/api/files/users/${testUserId}/document`)
      .attach('document', validFilePath)
      .field('documentType', 'INVALID_TYPE')
      .expect(400);

    expect(res.body.success).to.be.false;
    expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    expect(res.body.error.message).to.include('Tipo de documento inválido');
  });

  it('debería devolver error si el usuario no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/api/files/users/${fakeId}/document`)
      .attach('document', validFilePath)
      .field('documentType', 'DNI')
      .expect(404);

    expect(res.body.success).to.be.false;
    expect(res.body.error.code).to.equal('NOT_FOUND');
  });
});
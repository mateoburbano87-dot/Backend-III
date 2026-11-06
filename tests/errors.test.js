import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Manejo global de errores', () => {
  it('devuelve 404 con estructura uniforme para rutas inexistentes', async () => {
    const res = await request(app).get('/api/ruta-que-no-existe');
    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Ruta no encontrada',
      },
    });
  });
});
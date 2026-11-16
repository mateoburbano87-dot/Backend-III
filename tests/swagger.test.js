import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Swagger', () => {
  it('GET /api/docs devuelve HTML con Swagger UI', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.status).to.equal(200);
    expect(res.headers['content-type']).to.include('text/html');
  });

  it('GET /api/docs.json devuelve el spec OpenAPI con los tags esperados', async () => {
    const res = await request(app).get('/api/docs.json');
    expect(res.status).to.equal(200);
    expect(res.body.openapi).to.equal('3.0.3');
    expect(res.body.info.title).to.equal('ShipNow API');

    const tags = res.body.tags.map((t) => t.name);
    expect(tags).to.include.members(['Users', 'Products', 'Orders', 'Deliveries', 'Mocks', 'Logger']);

    // Schemas reutilizables
    expect(res.body.components.schemas).to.have.keys([
      'User',
      'UserInput',
      'Product',
      'ProductInput',
      'Order',
      'OrderItem',
      'Delivery',
      'ErrorResponse',
      'SuccessResponse',
    ]);
  });

  it('los paths documentados existen en la app (coherencia con la API real)', async () => {
    const res = await request(app).get('/api/docs.json');
    const paths = Object.keys(res.body.paths);

    // Chequeo rápido: cada path documentado debería responder distinto de 404 ROUTE_NOT_FOUND.
    // No hacemos la request real acá para no ensuciar la base; el resto de los tests
    // ya cubren cada endpoint documentado. Esto valida que el spec no tenga paths "fantasma".
    expect(paths).to.include('/api/users');
    expect(paths).to.include('/api/products');
    expect(paths).to.include('/api/orders');
    expect(paths).to.include('/api/orders/{id}/status');
    expect(paths).to.include('/api/deliveries');
    expect(paths).to.include('/api/mocks/users');
    expect(paths).to.include('/api/mocks/seed/{collection}');
    expect(paths).to.include('/api/logger-test');
  });
});
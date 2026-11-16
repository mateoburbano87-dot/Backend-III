import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description: 'API de logística con arquitectura por capas, mocks, errores centralizados y carga de archivos',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            documents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  originalName: { type: 'string' },
                  filename: { type: 'string' },
                  path: { type: 'string' },
                  mimetype: { type: 'string' },
                  size: { type: 'number' },
                  documentType: { type: 'string' },
                  uploadedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../docs/*.js'),
    path.join(__dirname, '../routes/*.js'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
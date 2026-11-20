import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';
import env from './env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.3', // <-- Corregido a 3.0.3
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description: 'API de logística preparada para producción',
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

// Función para decidir si montar Swagger según el entorno
export const shouldMountSwagger = () => {
  return env.nodeEnv !== 'production';
};
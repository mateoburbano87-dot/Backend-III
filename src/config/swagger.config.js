import swaggerJsdoc from 'swagger-jsdoc';
import env from './env.config.js';

// Configuración de Swagger separada de las rutas.
// Los JSDoc de cada endpoint viven en src/docs/*.js (no en los archivos de rutas).
const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description:
        'API de logística con arquitectura por capas (Controller - Service - Repository), ' +
        'módulo de mocks para generar datos de prueba, manejo centralizado de errores y logging. ' +
        'Esta documentación refleja el comportamiento real de los endpoints.',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Servidor local',
      },
    ],
    tags: [
      { name: 'Users', description: 'Operaciones sobre usuarios' },
      { name: 'Products', description: 'Operaciones sobre productos' },
      { name: 'Orders', description: 'Operaciones sobre pedidos' },
      { name: 'Deliveries', description: 'Operaciones sobre entregas' },
      { name: 'Mocks', description: 'Generación y carga de datos de prueba' },
      {
        name: 'Logger',
        description: 'Endpoint de validación del logger (NO es funcionalidad de negocio)',
      },
    ],
    components: {
      schemas: {
        // ---- Entidades ----
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6650a1b2c3d4e5f6a7b8c9d0' },
            name: { type: 'string', example: 'Ana Pérez' },
            email: { type: 'string', example: 'ana.perez@test.com' },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER', 'CLIENTE', 'REPARTIDOR'],
              example: 'CLIENTE',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', example: 'Ana Pérez' },
            email: { type: 'string', example: 'ana.perez@test.com' },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER', 'CLIENTE', 'REPARTIDOR'],
              example: 'CLIENTE',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6650a1b2c3d4e5f6a7b8c9d0' },
            name: { type: 'string', example: 'Caja mediana' },
            price: { type: 'number', example: 1500 },
            stock: { type: 'number', example: 20 },
            status: {
              type: 'string',
              enum: ['AVAILABLE', 'OUT_OF_STOCK'],
              example: 'AVAILABLE',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name: { type: 'string', example: 'Caja mediana' },
            price: { type: 'number', example: 1500 },
            stock: { type: 'number', example: 20 },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            product: { type: 'string', example: '6650a1b2c3d4e5f6a7b8c9d0' },
            quantity: { type: 'number', example: 2 },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6650a1b2c3d4e5f6a7b8c9d0' },
            user: { type: 'string', example: '6650a1b2c3d4e5f6a7b8c9d1' },
            products: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'],
              example: 'PENDING',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              example: 'MEDIUM',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Delivery: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6650a1b2c3d4e5f6a7b8c9d0' },
            order: { type: 'string', example: '6650a1b2c3d4e5f6a7b8c9d1' },
            repartidor: {
              type: 'string',
              nullable: true,
              example: '6650a1b2c3d4e5f6a7b8c9d2',
            },
            status: {
              type: 'string',
              enum: ['ASSIGNED', 'ON_THE_WAY', 'DELIVERED'],
              example: 'ASSIGNED',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // ---- Respuestas ----
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                  enum: [
                    'VALIDATION_ERROR',
                    'BAD_REQUEST',
                    'NOT_FOUND',
                    'CONFLICT',
                    'DATABASE_ERROR',
                    'ROUTE_NOT_FOUND',
                    'INTERNAL_ERROR',
                  ],
                },
                message: { type: 'string', example: 'Datos inválidos' },
              },
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            insertados: { type: 'number', example: 10 },
            coleccion: { type: 'string', example: 'users' },
          },
        },
      },
      responses: {
        ValidationError: {
          description: 'Datos inválidos o faltantes',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Campos obligatorios faltantes: name',
                },
              },
            },
          },
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                success: false,
                error: { code: 'NOT_FOUND', message: 'Producto no encontrado' },
              },
            },
          },
        },
        ConflictError: {
          description: 'Conflicto con un recurso existente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                success: false,
                error: { code: 'CONFLICT', message: 'Ya existe un usuario con ese email' },
              },
            },
          },
        },
        InternalError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
              },
            },
          },
        },
      },
    },
  },
  // Busco los JSDoc en src/docs (no en los archivos de rutas para no mezclar)
  apis: ['./src/docs/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
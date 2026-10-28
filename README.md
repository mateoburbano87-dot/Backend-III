# ShipNow API

API de logística con arquitectura por capas, mocking de datos, manejo centralizado
de errores, logging profesional con Winston y documentación interactiva con Swagger.

## Tabla de contenidos

- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Documentación Swagger](#documentación-swagger)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Scripts disponibles](#scripts-disponibles)
- [Endpoints](#endpoints)
- [Manejo de errores](#manejo-de-errores)
- [Logging](#logging)
- [Módulo de mocks](#módulo-de-mocks)
- [Testing](#testing)
- [Calidad de código](#calidad-de-código)

## Requisitos

- Node.js 20 o superior (usa `node --test` y `node --watch`)
- MongoDB corriendo localmente o una URI accesible

## Instalación y ejecución

1. Clonar el repo:
   ```bash
   git clone <url-del-repo>
   cd shipnow
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Copiar el `.env.example` a `.env` y completar los valores:
   ```bash
   cp .env.example .env
   ```

   Contenido esperado:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/shipnow
   NODE_ENV=development
   ```

4. Correr en modo desarrollo:
   ```bash
   npm run dev
   ```

5. Verificar que responde:
   ```bash
   curl http://localhost:3000/health
   ```

## Documentación Swagger

Con el server corriendo, abrir en el navegador:

- **Swagger UI**: http://localhost:3000/api/docs
- **JSON OpenAPI crudo** (para importar en Postman/Insomnia): http://localhost:3000/api/docs.json

La configuración de Swagger vive en `src/config/swagger.config.js` y los JSDoc de
cada endpoint en `src/docs/*.js`. **No hay documentación mezclada con las rutas**.

### Módulos documentados

- **Users**: CRUD completo.
- **Products**: CRUD completo.
- **Mocks**: generación de datos simulados y seed en Mongo.
- **Logger**: endpoint de prueba (no es funcionalidad de negocio).

### Aclaración sobre Orders y Deliveries

Los modelos `Order` y `Delivery` existen (y se usan en el módulo de mocks y en
sus correspondientes schemas de Swagger), pero **no exponen endpoints públicos
propios** en esta entrega. Si en el futuro se agregan, hay un `src/docs/orders.docs.js`
y `src/docs/deliveries.docs.js` con la documentación preparada.

### Schemas reutilizables

Definidos en `swagger.config.js`: `User`, `UserInput`, `Product`, `ProductInput`,
`Order`, `OrderItem`, `Delivery`, `ErrorResponse`, `SuccessResponse`.

### Respuestas de error documentadas

Todas las respuestas de error comparten la estructura uniforme del middleware:

```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

Códigos posibles: `VALIDATION_ERROR`, `BAD_REQUEST`, `NOT_FOUND`, `CONFLICT`,
`DATABASE_ERROR`, `ROUTE_NOT_FOUND`, `INTERNAL_ERROR`.

## Estructura del proyecto

```
src/
├── config/         # env.config.js, logger.config.js, swagger.config.js
├── constants/      # Roles, estados y prioridades (Object.freeze)
├── controllers/    # Manejo de req/res + validación de entrada
├── docs/           # JSDoc de los endpoints para Swagger
├── errors/         # Clases de error y diccionario
├── middlewares/    # errorHandler y notFoundHandler
├── models/         # Esquemas de Mongoose
├── repositories/   # Único lugar que habla con Mongoose
├── routes/         # Conectan path con método del controller
├── services/       # Lógica de negocio
└── utils/          # asyncHandler, validators, mockGenerator
logs/               # (ignorado en git) archivos rotados por fecha y tamaño
tests/              # Tests con node:test + supertest
```

## Scripts disponibles

| Script | Qué hace |
|--------|----------|
| `npm start` | Corre el server |
| `npm run dev` | Corre con `--watch` |
| `npm test` | Ejecuta `node --test tests/*.test.js` |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | ESLint con autofix |

## Endpoints

### Products

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista todos |
| GET | `/api/products/:id` | Obtiene uno |
| POST | `/api/products` | Crea |
| PUT | `/api/products/:id` | Actualiza |
| DELETE | `/api/products/:id` | Elimina |

### Users

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Lista todos |
| GET | `/api/users/:id` | Obtiene uno |
| POST | `/api/users` | Crea |
| PUT | `/api/users/:id` | Actualiza |
| DELETE | `/api/users/:id` | Elimina |

### Mocks

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/mocks/users?qty=5` | Usuarios simulados |
| GET | `/api/mocks/orders?qty=5` | Pedidos simulados |
| GET | `/api/mocks/deliveries?qty=5` | Entregas simuladas |
| POST | `/api/mocks/seed/users?qty=10` | Inserta usuarios |
| POST | `/api/mocks/seed/orders?qty=10` | Inserta pedidos |
| POST | `/api/mocks/seed/deliveries?qty=10` | Inserta entregas |

### Logger

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/logger-test` | Dispara un log de cada nivel (validación) |

### Documentación

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/docs` | Swagger UI |
| GET | `/api/docs.json` | Spec OpenAPI en JSON |

## Manejo de errores

Todos los errores esperados se lanzan desde los services usando clases propias.
El middleware global los transforma a una respuesta uniforme:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Producto no encontrado"
  }
}
```

### Cómo probar errores

```bash
# 404 controlado
curl http://localhost:3000/api/products/000000000000000000000000

# 400 validación de id
curl http://localhost:3000/api/users/id-invalido

# 400 body faltante
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"price": 100}'

# 409 conflicto
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"dup@test.com"}'
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"dup@test.com"}'

# 404 ruta inexistente
curl http://localhost:3000/api/cualquier-cosa
```

## Logging

Uso **Winston** con rotación diaria (`winston-daily-rotate-file`).

### Niveles

`fatal` > `error` > `warning` > `info` > `http` > `debug`

### Comportamiento por entorno

- **development**: consola muestra desde `debug`.
- **production**: consola muestra desde `info`.

Los archivos se escriben igual en ambos entornos.

### Archivos

Se guardan en `logs/` (ignorada en Git):

- `combined-YYYY-MM-DD.log`: desde `info` hacia arriba. Rota por fecha (14 días) y por tamaño (10 MB).
- `error-YYYY-MM-DD.log`: desde `warning` hacia arriba. Rota por fecha (30 días) y por tamaño (5 MB).

### Probar el logger

```bash
curl http://localhost:3000/api/logger-test
ls logs/
tail logs/error-$(date +%Y-%m-%d).log
```

## Módulo de mocks

Todos los endpoints aceptan `qty` (default 5, máximo 100).

### Validaciones

- `qty` debe ser entero positivo. `-1`, `0` o `abc` → `400 VALIDATION_ERROR`.
- `qty > 100` → `400 VALIDATION_ERROR`.
- Colección del seed debe ser `users`, `orders` o `deliveries`. Si no → `400 BAD_REQUEST`.
- Si falla Mongo → `500 DATABASE_ERROR` (no filtra detalles).

### Ejemplos

```bash
curl "http://localhost:3000/api/mocks/users?qty=2"
curl "http://localhost:3000/api/mocks/orders?qty=3"
curl -X POST "http://localhost:3000/api/mocks/seed/users?qty=10"
curl -X POST "http://localhost:3000/api/mocks/seed/orders?qty=5"
curl -X POST "http://localhost:3000/api/mocks/seed/deliveries?qty=5"
```

## Testing

Uso el runner nativo de Node (`node --test`) más `supertest`.

```bash
npm test
```

Cubre:

- validación de ids inválidos (400)
- validación de body faltante (400)
- colección inválida en mocks (400)
- `qty` inválido en mocks (400)
- ruta inexistente (404)
- endpoint de logger (200)
- **spec de Swagger disponible en `/api/docs.json`**

## Calidad de código

ESLint con configuración plana:

```bash
npm run lint
npm run lint:fix
```

Reglas: `no-console` (avisa si alguien deja un `console.log` suelto),
`no-unused-vars`, `prefer-const`, `eqeqeq`.

## Decisiones de diseño

- El **Repository** solo sabe cómo guardar y buscar en Mongo.
- El **Service** tiene las reglas del negocio.
- El **Controller** valida entrada, llama al service y devuelve la respuesta.
- Los **errores** se lanzan desde el service con clases propias, y un middleware
  global los transforma en respuestas uniformes.
- El **logger** vive en `config/` y se importa desde donde se necesite.
- La **configuración de Swagger** vive en `config/` y los JSDoc en `docs/`,
  para no mezclar documentación con rutas.
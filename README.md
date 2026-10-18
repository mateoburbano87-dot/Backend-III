# ShipNow API

API de logística con arquitectura por capas, mocking de datos, manejo centralizado
de errores y logging profesional con Winston.

## Tabla de contenidos

- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
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

   Contenido esperado del `.env`:
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

## Estructura del proyecto

```
src/
├── config/         # env.config.js y logger.config.js
├── constants/      # Roles, estados y prioridades (Object.freeze)
├── controllers/    # Manejo de req/res + validación de entrada
├── errors/         # Clases de error del dominio y diccionario
├── middlewares/    # errorHandler y notFoundHandler
├── models/         # Esquemas de Mongoose
├── repositories/   # Único lugar que habla con Mongoose
├── routes/         # Conectan path con método del controller
├── services/       # Lógica de negocio
└── utils/          # asyncHandler, validators, mockGenerator
logs/               # (ignorado en git) archivos rotados por fecha
tests/              # Tests con node:test + supertest
```

## Scripts disponibles

| Script | Qué hace |
|--------|----------|
| `npm start` | Corre el server en modo producción |
| `npm run dev` | Corre con `--watch` (recarga al guardar) |
| `npm test` | Ejecuta los tests |
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
| GET | `/api/logger-test` | Genera un log de cada nivel |

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

### Tipos de error disponibles

| Clase | Status | Code | Cuándo |
|-------|--------|------|--------|
| `ValidationError` | 400 | `VALIDATION_ERROR` | Datos inválidos o faltantes |
| `BadRequestError` | 400 | `BAD_REQUEST` | Solicitud mal formada |
| `NotFoundError` | 404 | `NOT_FOUND` | Recurso inexistente |
| `ConflictError` | 409 | `CONFLICT` | Recurso duplicado |
| `DatabaseError` | 500 | `DATABASE_ERROR` | Falla al guardar/leer en Mongo |
| `INTERNAL_ERROR` | 500 | `INTERNAL_ERROR` | Error inesperado no controlado |

### Cómo probar errores

```bash
# 404 controlado
curl http://localhost:3000/api/products/000000000000000000000000

# 400 validación de id
curl http://localhost:3000/api/users/id-invalido

# 400 validación de body
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

- **development**: consola muestra desde `debug`, ideal para ver todo.
- **production**: consola muestra desde `info`, para no inundar stdout.

En ambos entornos los archivos se escriben igual (ver abajo).

### Archivos

Se guardan en `logs/` (ignorada en Git):

- `combined-YYYY-MM-DD.log`: desde `info` hacia arriba. Retención: 14 días.
- `error-YYYY-MM-DD.log`: desde `warning` hacia arriba. Retención: 30 días.

### Probar el logger

```bash
curl http://localhost:3000/api/logger-test
```

Deberías ver en consola algo como:

```
2026-08-01 10:12:03 [info] Servidor ShipNow escuchando en el puerto 3000
2026-08-01 10:12:03 [info] Conexión a MongoDB establecida
2026-08-01 10:14:21 [warning] GET /api/products/id-invalido - VALIDATION_ERROR: Id inválido
2026-08-01 10:15:09 [error] POST /api/products - Error inesperado
2026-08-01 10:15:10 [fatal] Log de prueba: nivel fatal
```

Y en `logs/error-YYYY-MM-DD.log` solo quedan los niveles `warning`, `error` y `fatal`.

### Archivos ignorados en Git

```
logs/
*.log
.env
node_modules/
coverage/
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
# Datos simulados (no se guardan)
curl "http://localhost:3000/api/mocks/users?qty=2"
curl "http://localhost:3000/api/mocks/orders?qty=3"

# Seed (sí se guarda en Mongo)
curl -X POST "http://localhost:3000/api/mocks/seed/users?qty=10"
curl -X POST "http://localhost:3000/api/mocks/seed/orders?qty=5"
curl -X POST "http://localhost:3000/api/mocks/seed/deliveries?qty=5"
```

## Testing

Uso el runner nativo de Node (`node --test`) más `supertest` para pegarle a la app sin levantar el server.

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

## Calidad de código

ESLint con configuración plana:

```bash
npm run lint
npm run lint:fix
```

Reglas destacadas: `no-console` (avisa si alguien deja un `console.log` suelto),
`no-unused-vars`, `prefer-const`, `eqeqeq`.

## Decisiones de diseño

Separé la lógica entre Service y Repository porque:

- El **Repository** solo sabe cómo guardar y buscar en Mongo. Si mañana cambio
  la base, solo toco esta capa.
- El **Service** tiene las reglas del negocio (por ejemplo, marcar un producto
  como `OUT_OF_STOCK` si no tiene stock, verificar emails duplicados, etc.).
- El **Controller** nunca toca Mongoose ni decide reglas. Solo valida entrada,
  llama al service y devuelve la respuesta.
- Los **errores** se lanzan desde el service con clases propias, y un middleware
  global los transforma en respuestas uniformes.
- El **logger** vive en `config/` y se importa desde donde se necesite. En
  desarrollo muestra debug, en producción desde info. Los errores van a archivo
  con rotación diaria.


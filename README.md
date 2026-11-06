## Scripts disponibles

| Script | Qué hace |
|--------|----------|
| `npm start` | Corre el server |
| `npm run dev` | Corre con `--watch` |
| `npm test` | Ejecuta la suite con Mocha (usa `.env.test`) |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | ESLint con autofix |

## Testing

### Herramientas

- **Mocha**: organiza y ejecuta los tests (`describe` / `it`).
- **Chai**: assertions legibles (`expect(...).to.equal(...)`).
- **Supertest**: pega contra la app de Express sin abrir puerto.

### Cómo ejecutar

1. Tener MongoDB corriendo.
2. Asegurarse de tener `.env.test` (hay un `.env.test.example`). Por defecto apunta a `mongodb://localhost:27017/shipnow_test`, una base separada de la de desarrollo.
3. Correr:
   ```bash
   npm test
   ```
   El script setea `NODE_ENV=test` y Mocha carga `tests/**/*.test.js`.

### Base de datos de testing

Los tests usan **una base distinta** (`shipnow_test`) definida en `.env.test`. Entre cada bloque de tests se limpian las colecciones con `cleanDB()` (ver `tests/helpers/setup.js`) y al final se dropea la base. Así podés correr `npm test` dos veces seguidas sin tocar nada a mano.

### Módulos cubiertos

| Recurso | Archivo | Casos |
|---------|---------|-------|
| Users | `tests/users.test.js` | GET listado, GET por id (inválido / inexistente), POST (éxito, faltante, duplicado) |
| Products | `tests/products.test.js` | GET listado, OUT_OF_STOCK, POST (éxito, faltante), GET por id inexistente |
| Orders | `tests/orders.test.js` | GET listado, POST (éxito, faltante, usuario inexistente), GET por id, PATCH status (éxito, estado inválido, inexistente) |
| Deliveries | `tests/deliveries.test.js` | GET listado, GET por id (inexistente / inválido) |
| Mocks | `tests/mocks.test.js` | GET users (éxito, qty negativo, no numérico, excede máximo), GET orders, POST seed (éxito, colección inválida, qty inválido) |
| Logger | `tests/logger.test.js` | GET endpoint, valida estructura y niveles |
| Swagger | `tests/swagger.test.js` | GET `/api/docs` (HTML), GET `/api/docs.json` (spec con tags y schemas), coherencia de paths |
| Errores globales | `tests/errors.test.js` | 404 ruta inexistente con formato uniforme |

### Variables de entorno necesarias

Solo las del `.env.test`:

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/shipnow_test
NODE_ENV=test
```

Si `NODE_ENV` no es `test`, la app intenta cargar `.env` normal. El script de test se encarga de setearlo.

### Datos de prueba

Nunca se usan datos reales. Los tests crean sus propios usuarios/productos con `UserModel.create(...)` / `ProductModel.create(...)`, y los mocks se prueban generando datos nuevos. Cada `afterEach` limpia la base para que los tests sean repetibles e independientes del orden.

## Aclaración sobre Orders y Deliveries

Ambos módulos están **montados como rutas reales** (`/api/orders`, `/api/deliveries`) y documentados en Swagger. Los endpoints disponibles son:

- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
- `DELETE /api/orders/:id`
- `GET /api/deliveries`
- `GET /api/deliveries/:id`

Si agregás/modificás un endpoint, acordate de actualizar tanto el doc en `src/docs/` como el test correspondiente.
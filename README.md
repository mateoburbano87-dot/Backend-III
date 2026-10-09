# ShipNow API

API de logística refactorizada con arquitectura por capas (Controller - Service - Repository),
módulo de mocking para generar datos de prueba y una capa centralizada de manejo de errores.

## Estructura del proyecto

```
src/
├── config/         # Validación de variables de entorno
├── constants/      # Roles, estados, prioridades (todo congelado)
├── controllers/    # Manejo de req/res, sin lógica de negocio
├── errors/         # Clases de error del dominio y diccionario
├── middlewares/    # errorHandler y notFoundHandler globales
├── models/         # Esquemas de Mongoose
├── repositories/   # Único lugar que habla con Mongoose
├── routes/         # Conectan path con método del controller
├── services/       # Lógica de negocio
└── utils/          # asyncHandler, mockGenerator
```

## Decisiones de diseño

Separé la lógica entre Service y Repository porque:

- El **Repository** solo sabe cómo guardar y buscar datos en Mongo. Si mañana cambio la base de datos, solo toco esta capa.
- El **Service** tiene las reglas del negocio (por ejemplo, marcar un producto como `OUT_OF_STOCK` si no tiene stock, o verificar que no exista un email duplicado).
- El **Controller** nunca toca Mongoose ni decide reglas: solo recibe la request, llama al service y devuelve la respuesta.
- Los **errores** se lanzan desde el service con clases propias (`NotFoundError`, `ValidationError`, etc.) y un único middleware global los transforma en respuestas HTTP uniformes.

## Endpoints

### Products

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista todos los productos |
| GET | `/api/products/:id` | Obtiene un producto por id |
| POST | `/api/products` | Crea un producto |
| PUT | `/api/products/:id` | Actualiza un producto |
| DELETE | `/api/products/:id` | Elimina un producto |

### Users

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Lista todos los usuarios |
| GET | `/api/users/:id` | Obtiene un usuario por id |
| POST | `/api/users` | Crea un usuario |
| PUT | `/api/users/:id` | Actualiza un usuario |
| DELETE | `/api/users/:id` | Elimina un usuario |

## Manejo de errores

Todos los errores esperados del dominio se lanzan desde los **services** usando clases propias
que heredan de `AppError`. El middleware global `errorHandler` los captura y devuelve siempre
la misma estructura:


### Tipos de errores disponibles

| Clase | Status | Code | Cuándo se usa |
|-------|--------|------|---------------|
| `ValidationError` | 400 | `VALIDATION_ERROR` | Datos inválidos o faltantes |
| `BadRequestError` | 400 | `BAD_REQUEST` | Solicitud mal formada (ej: colección inválida) |
| `NotFoundError` | 404 | `NOT_FOUND` | Recurso inexistente |
| `ConflictError` | 409 | `CONFLICT` | Recurso duplicado (ej: email en uso) |
| `DatabaseError` | 500 | `DATABASE_ERROR` | Falla al guardar/leer en Mongo |

Si ocurre un error no controlado, el middleware responde con `INTERNAL_ERROR` (500). En
desarrollo muestra el mensaje real, en producción uno genérico para no filtrar detalles.




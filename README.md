## Scripts disponibles

| Script | Qué hace |
|--------|----------|
| `npm start` | Corre el server |
| `npm run dev` | Corre con `--watch` |
| `npm test` | Ejecuta la suite con Mocha (usa `.env.test`) |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | ESLint con autofix |

> **Nota:** `npm test` dispara automáticamente el script `pretest`, que copia
> `.env.test.example` a `.env.test` si el archivo no existe. Así la suite corre
> desde cero sin pasos manuales.

## Testing

### Herramientas

- **Mocha**: organiza y ejecuta los tests (`describe` / `it`).
- **Chai**: assertions legibles (`expect(...).to.equal(...)`).
- **Supertest**: pega contra la app de Express sin abrir puerto.

### Cómo ejecutar

1. Tener MongoDB corriendo.
2. Asegurarse de tener `.env.test` (hay un `.env.test.example`). Por defecto apunta a `mongodb://localhost:27017/shipnow_test`, una base separada de la de desarrollo.
   - **Opción automática:** el script `pretest` lo genera solo si no existe.
   - **Opción manual:** `cp .env.test.example .env.test`.
3. Correr:
   ```bash
   npm test
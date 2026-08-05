# ShipNow API — Backend 3 - Comisión 77395

API de backend para un módulo de mocking que genera datos falsos y permite insertarlos en MongoDB.

## 📌 Descripción

Este proyecto expone:
- APIs de productos, carritos y usuarios
- APIs de mocks en `/api/mocks` para generar datos de prueba
- vistas manejadas con Handlebars en `/` y `/realtimeproducts`
- manejo de errores centralizado con `DomainError` y middleware global

## 🚀 Instalación

```bash
npm install
```

## 🧾 Logging y monitoreo básico

El proyecto usa Winston como logger centralizado para registrar eventos tanto en consola como en archivos.

### Niveles disponibles
- `debug`
- `http`
- `info`
- `warning`
- `error`
- `fatal`

### Comportamiento por entorno
- En desarrollo se muestran logs más detallados, incluyendo `debug`.
- En producción el logger se enfoca en mensajes relevantes como `info`, `warning`, `error` y `fatal`.

### Endpoint de prueba del logger

```bash
curl http://localhost:8080/api/logger/test
```

Este endpoint genera pruebas de todos los niveles para verificar que los registros aparecen en consola y en los archivos de logs.

### Archivos de logs
- Los logs generales se almacenan en la carpeta `logs/`.
- Los errores y fallas críticas se guardan en archivos rotativos con nombre tipo `error-YYYY-MM-DD.log`.
- La rotación limita tamaño y cantidad de archivos mantenidos.

### Git
- Los archivos generados en `logs/` quedan excluidos del repositorio mediante `.gitignore`.

## 📦 Variables de entorno

Crea un archivo `.env` en la raíz con estas variables:

```env
MONGO_USER=<usuario>
MONGO_PASS=<contraseña>
MONGO_SHARD=<shard>
MONGO_CLUSTER=<cluster>
MONGO_ATLAS_SHARD=<atlas-shard>
MONGO_DB_NAME=<nombre-de-la-base>
```

## ▶️ Comandos

```bash
npm start
```

> El servidor arranca en `http://localhost:8080` y monta los endpoints bajo `/api`.

## 🌐 Rutas principales

### Rutas de vistas
- `GET /` — lista de productos con paginación
- `GET /cart/:cid` — detalle de carrito por ID

### Rutas API core
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

- `GET /api/carts`
- `GET /api/carts/:id`
- `POST /api/carts`
- `PUT /api/carts/:cid/product/:pid`
- `DELETE /api/carts/:cid/product/:pid`

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

## 🧪 Endpoints de mocks

### Usuarios
- `GET /api/mocks/users/get?quantity=N`
  - Genera `N` usuarios fake (por defecto 10)
- `POST /api/mocks/users/insert?quantity=N`
  - Inserta `N` usuarios fake en MongoDB

### Productos
- `GET /api/mocks/products/get?quantity=N`
  - Genera `N` productos fake
- `POST /api/mocks/products/insert?quantity=N`
  - Inserta `N` productos fake en MongoDB

### Carritos
- `GET /api/mocks/carts/get?quantity=N`
  - Genera `N` carritos fake
- `POST /api/mocks/carts/insert?quantity=N`
  - Inserta `N` carritos fake en MongoDB

### Entregas
- `GET /api/mocks/delivery/get?quantity=N`
  - Genera `N` entregas fake
- `POST /api/mocks/delivery/insert?quantity=N`
  - Inserta `N` entregas fake en MongoDB

## ✅ Ejemplos

```bash
# Obtener 5 usuarios simulados
curl "http://localhost:8080/api/mocks/users/get?quantity=5"

# Insertar 3 productos simulados en MongoDB
curl -X POST "http://localhost:8080/api/mocks/products/insert?quantity=3"

# Obtener 2 carritos simulados
curl "http://localhost:8080/api/mocks/carts/get?quantity=2"

# Insertar 4 carritos en MongoDB
curl -X POST "http://localhost:8080/api/mocks/carts/insert?quantity=4"

# Obtener 5 entregas simuladas
curl "http://localhost:8080/api/mocks/delivery/get?quantity=5"

# Insertar 5 entregas en MongoDB
curl -X POST "http://localhost:8080/api/mocks/delivery/insert?quantity=5"
```

## 🚨 Estructura de respuesta de error

Las respuestas de error usan el middleware global y devuelven siempre un JSON con esta forma:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Descripción legible del error",
  "details": null
}
```

- `status`: siempre `error`.
- `code`: clave interna del error, como `VALIDATION_FAILED`, `BAD_ID` o `MOCK_QUANTITY_INVALID`.
- `message`: texto claro para el cliente.
- `details`: datos adicionales cuando existen validaciones o errores de Mongoose.

### Ejemplo de error de cantidad inválida

```bash
curl "http://localhost:8080/api/mocks/products/get?quantity=-5"
```

```json
{
  "status": "error",
  "code": "MOCK_QUANTITY_INVALID",
  "message": "Cantidad de mocks inválida.",
  "details": { "provided": "-5" }
}
```

## ⚠️ Cómo probar casos inválidos

- `quantity` faltante o no numérico en `/api/mocks/*/get` y `/api/mocks/*/insert` devuelve `400`.
- Si no hay productos en la colección `products`, entonces `/api/mocks/carts/insert` puede devolver `MOCKS_NO_PRODUCTS`.
- En los endpoints principales, un `id` inválido arroja `BAD_ID` y un recurso inexistente arroja `PRODUCT_NOT_FOUND`, `USER_NOT_FOUND` o `PURCHASE_NOT_FOUND`.

## 🔧 Notas

- El endpoint de insert de carritos requiere que haya productos existentes en la colección `products`.
- El proyecto utiliza `mongoose` y `faker` para la generación y persistencia de datos de prueba.

## 📁 Archivo adicional

Se incluye `Postman_Collection/backend-3-77395.postman_collection.json` con pruebas de los endpoints.

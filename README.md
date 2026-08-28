# ShipNow API — Backend 3 - Comisión 77395

API de backend para un ShipNow con un módulo de api funcional y un módulo de api de mocking que genera datos falsos y permite insertarlos en MongoDB.

## 📌 Descripción

Este proyecto expone:
- APIs de productos, carritos, delivery y usuarios
- APIs de mocks en `/api/mocks` para generar datos de prueba
- vistas manejadas con Handlebars en `/` y `/realtimeproducts`
- manejo de errores centralizado con `DomainError` y middleware global
- log a bajo nivel en toda la arquitectura en capas 

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
- La información y avisos se estarian guardando en archivos rotativos bajo el nombre `application-YYYY-MM-DD.log`.
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
NODE_ENV=<ambiente-de-ejecución>
```

## ▶️ Comandos

```bash
npm start
```

> El servidor arranca en `http://localhost:8080` y monta los endpoints bajo `/api`.

## 🌐 Rutas principales

### Rutas de vistas
- `GET /`
- `GET /cart/:cid`

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
  - Genera `N` productos fake (por defecto 10)
- `POST /api/mocks/products/insert?quantity=N`
  - Inserta `N` productos fake en MongoDB

### Carritos
- `GET /api/mocks/carts/get?quantity=N`
  - Genera `N` carritos fake (por defecto 10)
- `POST /api/mocks/carts/insert?quantity=N`
  - Inserta `N` carritos fake en MongoDB

### Entregas
- `GET /api/mocks/delivery/get?quantity=N`
  - Genera `N` entregas fake (por defecto 10)
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

## 📘 Documentación de la API con Swagger

El proyecto expone documentación interactiva de la API generada con **Swagger/OpenAPI** (`swagger-jsdoc` + `swagger-ui-express`). La configuración vive separada de las rutas, en `src/config/swagger.js`, y se monta en `server.js` junto con el resto de la app — no requiere un comando aparte.

### Cómo acceder

Con el servidor levantado (`npm start`), entrá a:

```
http://localhost:8080/api/docs
```

Desde ahí podés ver cada endpoint agrupado por módulo, probarlo directamente con "Try it out" (incluye los mocks e inserciones a MongoDB), y consultar los schemas y errores documentados.

### Qué está documentado

La documentación está organizada por tags:

| Tag | Cubre |
|---|---|
| **Users** | CRUD de usuarios (`/api/users`) |
| **Orders** | CRUD de pedidos/carritos (`/api/carts`) |
| **Deliveries** | CRUD de entregas (`/api/delivery`) |
| **Mocks** | Generación e inserción de datos de prueba (`/api/mocks/*`) |
| **Logger** | Endpoint de prueba del logger (`/api/logger/test`) |

Cada endpoint documenta método, ruta, parámetros, body esperado (cuando aplica) y las respuestas reales — tanto la exitosa como los errores puntuales que ese endpoint puede devolver (`BAD_ID`, `USER_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `ROUTE_NOT_FOUND`, `ID_NOT_FOUND`, `PURCHASE_NOT_FOUND`, `VALIDATION_FAILED`, `MOCK_QUANTITY_INVALID`, `MOCKS_NO_PRODUCTS`, etc.), reutilizando los mismos schemas (`User`, `Order`, `Delivery`, `OrderItem`, `ErrorResponse`, `SuccessResponse`) para evitar duplicación.

> NOTA: el endpoint de `/api/products` no está incluido en Swagger ya que no forma parte de los tags pedidos para esta pre-entrega (Users, Orders, Deliveries, Mocks, Logger).

## 📎 Carga de archivos (Multer)

ShipNow permite subir documentos de usuario y comprobantes de entrega usando [Multer](https://github.com/expressjs/multer). El archivo se guarda en el filesystem del servidor; **en la base de datos solo se registran los metadatos**, nunca el contenido del archivo.

### Configuración

Toda la configuración de Multer vive centralizada en `src/config/multer.js` (nunca dentro de los routers): carpetas de destino, generación de nombres, tipos/tamaño permitidos y helpers de limpieza/movimiento de archivos.

- **Tipos de archivo permitidos**: `application/pdf`, `image/jpeg`, `image/png`.
- **Tamaño máximo**: 5MB por archivo.
- **Nombre generado**: `<timestamp>-<uuid>.<ext>` (nunca se usa el nombre original del cliente para guardar en disco).

### Estructura de carpetas

```
uploads/
  users/       -> documentos de usuario (dni, comprobante de domicilio, otros)
  licenses/    -> licencias (documentType = "license")
  deliveries/  -> comprobantes de entrega
```

Las carpetas se crean automáticamente al levantar la app (no hace falta crearlas a mano) y **están en `.gitignore`**: los archivos subidos nunca se suben al repositorio.

### Endpoints

#### `POST /api/users/:id/documents`

Sube un documento y lo asocia a un usuario existente.

| Campo (form-data) | Tipo | Requerido | Descripción |
|---|---|---|---|
| `document` | file | ✅ | El archivo a subir (pdf/jpg/png, máx. 5MB) |
| `documentType` | text | ❌ | Uno de: `dni`, `license`, `proof_of_address`, `other`. Si no se envía, se guarda como `other`. Si es `license`, el archivo se reubica en `uploads/licenses`. |

```bash
curl -X POST http://localhost:8080/api/users/<id>/documents \
  -F "document=@./dni.jpg" \
  -F "documentType=dni"
```

Respuesta exitosa (201):

```json
{
  "success": true,
  "message": "Documento cargado correctamente.",
  "data": {
    "userId": "64f...",
    "document": {
      "originalName": "dni.jpg",
      "storedName": "1730000000000-9c1b2a3d.jpg",
      "path": "uploads/users/1730000000000-9c1b2a3d.jpg",
      "mimeType": "image/jpeg",
      "size": 204800,
      "documentType": "dni",
      "uploadedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

#### `POST /api/delivery/:id/receipt`

Sube un comprobante (foto, firma, remito) y lo asocia a una entrega existente.

| Campo (form-data) | Tipo | Requerido | Descripción |
|---|---|---|---|
| `receipt` | file | ✅ | El archivo a subir (pdf/jpg/png, máx. 5MB) |
| `documentType` | text | ❌ | Uno de: `delivery_receipt`, `signature`, `photo`, `other`. Por defecto `delivery_receipt`. |

Ambos endpoints están documentados como `multipart/form-data` en Swagger (`/api/docs`), con ejemplos de request y de cada error posible.

### Errores específicos de archivos

Todos responden con el mismo formato general de error del proyecto (`status`, `code`, `message`, `details`):

| Code | Status | Cuándo ocurre |
|---|---|---|
| `FILE_REQUIRED` | 400 | No se envió ningún archivo |
| `FILE_TYPE_NOT_ALLOWED` | 400 | El mimetype no es pdf/jpg/png |
| `FILE_TOO_LARGE` | 400 | El archivo supera los 5MB (error nativo de Multer, traducido al formato general) |
| `INVALID_FIELD_NAME` | 400 | El campo del archivo no es el esperado (`document` / `receipt`) |
| `DOCUMENT_TYPE_INVALID` | 400 | Se envió `documentType` con un valor fuera de los permitidos |
| `BAD_ID` | 400 | El ID de la entidad (usuario/entrega) no tiene formato válido |
| `USER_NOT_FOUND` / `PURCHASE_NOT_FOUND` | 404 | La entidad a la que se quiere asociar el archivo no existe |
| `FILE_SAVE_ERROR` | 500 | Error inesperado al mover/guardar el archivo en disco |

Si la validación falla **después** de que Multer ya guardó el archivo (por ejemplo, el usuario no existe), el archivo se borra automáticamente del disco para no dejarlo huérfano sin asociar a ninguna entidad.

### Logging

El logger registra: carga exitosa (`info`), intento de tipo de archivo no permitido (`warning`), y errores al guardar/mover el archivo (`error`). Ver `src/config/multer.js` y los servicios `users.js` / `delivery.js`.

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
- `message`: texto claro para el usuario.
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
- En los endpoints principales, un `id` inválido devuelve `BAD_ID` y un recurso inexistente devuelve `PRODUCT_NOT_FOUND`, `USER_NOT_FOUND` o `PURCHASE_NOT_FOUND`.

## 🔧 Notas

- El endpoint de insert de carritos requiere que haya productos existentes en la colección `products`.
- El proyecto utiliza `mongoose` y `faker` para la generación y persistencia de datos de prueba.
- El manejo de `state` (con sus valores permitidos: `pending`, `confirmed`, `shipped`, `delivered`) se encuentra en el módulo de `Order` (carts). El módulo de `Delivery` no tiene un campo de estado propio: solo asocia un `order` con un `deliveryMan`, así que el ciclo de vida del pedido (y la validación de su estado) se sigue consultando desde `Order`. No hace falta duplicar ese campo en `Delivery`.

## 📁 Archivo adicional

Se incluye `Postman_Collection/backend-3-77395.postman_collection.json` con pruebas de los endpoints. (se incluyen las pruebas de Multer -hay que actualizar las imágenes mapeadas en el request nada mas-)

## 🧪 Testing

El proyecto incluye una suite de tests funcionales automatizados que valida los endpoints principales de la API contra una base de datos de testing separada de la de desarrollo.

### Herramientas utilizadas

- **[Mocha](https://mochajs.org/)**: organiza y ejecuta la suite de tests (`describe`/`it`).
- **[Chai](https://www.chaijs.com/)**: librería de aserciones (`expect`) para validar status codes y estructura de las respuestas.
- **[Supertest](https://github.com/ladjs/supertest)**: realiza peticiones HTTP contra la app de Express en memoria, sin necesidad de levantar un puerto real.

La app de Express (`src/config/app.js`) está separada del arranque del servidor (`src/server.js`, que es el único lugar donde se llama a `app.listen`). Esto permite que los tests usen `app` directamente y Supertest sin tener que abrir manualmente un puerto ni depender de un servidor real.

### Entorno de testing separado

- Las variables de entorno de testing viven en un archivo `.env.test` (se debe ubicar en la raiz del proyecto; hay una plantilla en `.env.test.example`).
- Al ejecutar `npm test`, el script fuerza `NODE_ENV=test`, y `src/config/mongo.js` detecta esa variable y carga `.env.test` en lugar de `.env`.
- **Se requiere una base de datos de MongoDB separada de la de desarrollo** (es decir, otro `MONGO_DB_NAME` en la config del .env, el ejemplo que yo use es: `shipnow_test`). Los tests escriben y borran datos reales en esa base, por lo que **NUNCA** debe apuntar a la base de desarrollo/producción.
- Al finalizar toda la suite, se hace `dropDatabase()` sobre la conexión de testing como limpieza final (ver `test/setup.js`).

Variables necesarias en `.env.test`:

```env
NODE_ENV=test
MONGO_USER=<usuario>
MONGO_PASS=<contraseña>
MONGO_CLUSTER=<cluster>
MONGO_DB_NAME=shipnow_test
MONGO_SHARD=<shard>
MONGO_ATLAS_SHARD=<atlas-shard>
```

### Cómo ejecutar los tests

```bash
npm test
```

Esto corre `cross-env NODE_ENV=test mocha`, que:
1. Carga `test/setup.js` (root hooks), que conecta a la base de testing antes de correr la suite y la limpia (`dropDatabase` + `disconnect`) al finalizar.
2. Ejecuta todos los archivos `test/**/*.test.js`.

### Módulos/endpoints cubiertos

| Archivo | Endpoints | Casos cubiertos |
|---|---|---|
| `test/users.test.js` | `GET /api/users`, `POST /api/users`, `GET /api/users/:id` | listado paginado, creación válida (201), falta de password (`USER_CREATE_NOT_PASSWORD`), campo con tipo inválido (`VALIDATION_FAILED`), búsqueda por id existente, `BAD_ID`, `USER_NOT_FOUND` |
| `test/orders.test.js` | `GET /api/carts`, `POST /api/carts`, `GET /api/carts/:id` | listado paginado, creación de pedido válido (201) usando un producto de prueba, body que no es array (`PRODUCT_CREATE_MUST_BE_ARRAY`), cantidad inválida (`VALIDATION_FAILED`), producto inexistente (`VALIDATION_FAILED`), búsqueda por id existente, `BAD_ID`, `PURCHASE_NOT_FOUND` |
| `test/mocks.test.js` | `GET/POST /api/mocks/users/*`, `POST /api/mocks/carts/insert` | generación sin persistir, cantidad inválida (`MOCK_QUANTITY_INVALID`), inserción real en Mongo, inserción de pedidos mock cuando no hay productos (`MOCKS_NO_PRODUCTS`) y cuando sí hay |
| `test/logger.test.js` | `GET /api/logger/test` | respuesta 200 y estructura `{ success, message }` |
| `test/swagger.test.js` | `GET /api/docs`, ruta inexistente | Swagger responde 200 en HTML; ruta inexistente devuelve 404 con el formato de error (`ROUTE_NOT_FOUND`) documentado |
| `test/uploads.test.js` | `POST /api/users/:id/documents`, `POST /api/delivery/:id/receipt` | carga válida (201) con metadatos correctos, reubicación a `licenses/` cuando `documentType=license`, archivo faltante (`FILE_REQUIRED`), tipo de documento inválido (`DOCUMENT_TYPE_INVALID`), tipo de archivo no permitido (`FILE_TYPE_NOT_ALLOWED`), `BAD_ID`, entidad inexistente (`USER_NOT_FOUND` / `PURCHASE_NOT_FOUND`) |

En todos los casos se valida tanto el status HTTP como la estructura del body (propiedades esperadas, `status: 'error'`, `code`, etc.), no solo que el endpoint "responda".

### Datos de prueba y limpieza

- Los datos se generan dentro del propio test (`test/helpers/testData.js`: crea usuarios/productos válidos con emails únicos) o mediante los endpoints de mocks, nunca dependiendo de datos cargados manualmente.
- Cada suite guarda los IDs que crea y los borra en sus hooks `after`/`afterEach` (borrado selectivo por `_id`, no por estado previo).
- Los tests de mocks que insertan en Mongo comparan los IDs existentes antes/después de la inserción para borrar únicamente lo que ese test generó, sin importar qué datos hubiera antes.
- Al final de toda la suite (`test/setup.js`) se hace un `dropDatabase()` de la base de testing como red de seguridad adicional.
- Ningún test depende del orden de ejecución de los demás: cada uno crea y limpia sus propios datos, y los casos que necesitan un estado puntual (por ejemplo "no hay productos cargados") lo fuerzan explícitamente en lugar de asumirlo.
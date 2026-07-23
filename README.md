# Proyecto Backend 3 - comisión 77395 - Products & Carts API

# ShipNow API — Módulo de Mocking

Este módulo agrega endpoints bajo `/api/mocks` para generar datos simulados (usuarios, productos, carritos/pedidos y entregas) y, opcionalmente, insertarlos en MongoDB como registros de prueba.  
El objetivo es facilitar el desarrollo y las pruebas sin depender de datos reales cargados a mano.

---

## 🚀 Endpoints disponibles

### 1. Usuarios
- **GET /api/mocks/users?quantity=N**  
  Devuelve `N` usuarios simulados (por defecto 10 si no se pasa `quantity`).  
  Cada usuario incluye:
  - `name`, `last_name`
  - `email`, `password`
  - `status` (booleano)
  - `role` (array con un rol válido de `CONST.USER_ROLES`)

- **POST /api/mocks/users?quantity=N**  
  Inserta `N` usuarios simulados en la colección `users` de MongoDB.  
  Responde con `{ insertedCount: N }`.

---

### 2. Productos
- **GET /api/mocks/products?quantity=N**  
  Devuelve `N` productos simulados (por defecto 10).  
  Cada producto incluye:
  - `title`, `description`
  - `price`, `category`
  - `stock` (unidades de productos como número entero)
  - `thumbnails` (array de URLs de imágenes falsas)
  - `status` (booleano)

- **POST /api/mocks/products?quantity=N**  
  Inserta `N` productos simulados en la colección `products`.  
  Responde con `{ insertedCount: N }`.

---

### 3. Carritos / Pedidos
- **GET /api/mocks/carts?quantity=N**  
  Devuelve `N` carritos simulados (por defecto 10).  
  Cada carrito incluye:
  - `products`: lista de productos con `ObjectId` falso y cantidad
  - `state`: uno de `pending`, `confirmed`, `shipped`, `delivered`
  - `priority`: uno de `low`, `medium`, `high`
  - `user`: referencia a un usuario (inventado en el mock o real en DB)

- **POST /api/mocks/carts?quantity=N**  
  Inserta `N` carritos en la colección `carts`.  
  Los productos referencian a `_id` reales de la colección `products`.  
  Responde con `{ insertedCount: N }`.

---

### 4. Entregas
- **GET /api/mocks/delivery/get?quantity=N**  
  Devuelve `N` entregas simuladas (por defecto 10).  
  Cada entrega incluye:
  - `order`: referencia a un pedido/carrito (ObjectId falso)
  - `deliveryMan`: objeto con datos inventados de un usuario con rol `"dealer"` (repartidor)
  - `date`: fecha reciente generada con faker  

  👉 Aquí se refleja la **relación entre pedido y repartidor**: cada entrega vincula un pedido con un usuario de rol válido.

- **POST /api/mocks/delivery/insert?quantity=N**  
  Inserta `N` entregas en la colección `deliveries`.  
  Se guardan las referencias (`order` y `deliveryMan` como ObjectId) y la fecha.  
  Responde con `{ insertedCount: N }`.

---

## 📌 Cómo probar

1. Levantar el servidor:
   ```bash
   npm run dev

## Ejemplos para probar bash:

# Obtener 5 usuarios simulados
GET http://localhost:8080/api/mocks/users?quantity=5

# Insertar 3 productos simulados en MongoDB
POST http://localhost:8080/api/mocks/products?quantity=3

# Obtener 2 carritos simulados
GET http://localhost:8080/api/mocks/carts?quantity=2

# Insertar 4 carritos en MongoDB
POST http://localhost:8080/api/mocks/carts?quantity=4

# Obtener 5 entregas simuladas
GET http://localhost:8080/api/mocks/delivery/get?quantity=5

# Insertar 5 entregas en MongoDB
POST http://localhost:8080/api/mocks/delivery/insert?quantity=5


# SE ADJUNTA COLLECTION DE POSTMAN CON LAS PRUEBAS COMPLETAS!! #
# Proyecto Backend 3 - comisión 77395 - Products & Carts API

# ShipNow API — Módulo de Mocking

Este módulo agrega endpoints bajo `/api/mocks` para generar datos simulados (usuarios, productos y carritos/pedidos) y, opcionalmente, insertarlos en MongoDB como registros de prueba.  
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

- **POST /api/mocks/carts?quantity=N**  
  Inserta `N` carritos en la colección `carts`.  
  Los productos referencian a `_id` reales de la colección `products`.  
  Responde con `{ insertedCount: N }`.

---

## 📌 Cómo probar

1. Levantar el servidor:
   ```bash
   npm run dev
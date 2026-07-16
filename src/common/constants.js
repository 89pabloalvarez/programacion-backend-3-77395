export const CONSTANTS = {
    PORT: 8080,
    BASEURL: `http://localhost:8080`,
    DIR_URL_ROOT: '/api',
    DIR_URL_PRODUCTS: '/products',
    DIR_URL_CARTS: '/carts',
    PRODUCT_NOT_FOUND: 'Producto no encontrado.',
    PURCHASE_NOT_FOUND: 'Compra no encontrada.',
    BAD_ID: 'El ID no tiene formato válido.',
    SERVER_ERROR: 'Error interno del servidor.',
    PRODUCT_CREATE_MUST_BE_ARRAY: 'El body debe ser un array.',
    REQUEST_NOT_COMPLETE: 'Solicitud incompleta.',
    QUANTITY_NOT_DEFINED: 'No se encontró el campo "quantity" en el cuerpo de la solicitud.',
    QUANTITY_INVALID_VALUE: 'Cantidad no válida.',
    PRODUCT_CREATE_ALLOWED_FIELDS: [
        "title",
        "price",
        "category",
        "thumbnails",
        "description",
        "stock"
    ],
    PRODUCT_EDIT_ALLOWED_FIELDS: [
        "title",
        "price",
        "category",
        "thumbnails",
        "description",
        "stock",
        "status"
    ],
    PRODUCT_FIELDS_SCHEMA: {
        title: "string",
        price: "number",
        category: "string",
        thumbnails: "array:string",
        description: "string",
        stock: "integer",
        status: "boolean"
    },
    CART_CREATE_ALLOWED_FIELDS: [
        "productId",
        "quantity"
    ],
    CART_FIELDS_SCHEMA: {
        productId: "string",
        quantity: "number"
    }
}
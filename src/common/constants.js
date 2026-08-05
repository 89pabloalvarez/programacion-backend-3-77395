export const CONSTANTS = Object.freeze({
    PORT: 8080,
    BASEURL: `http://localhost:8080`,
    DIR_URL_ROOT: '/api',
    DIR_URL_MOCKS: '/mocks',
    DIR_URL_PRODUCTS: '/products',
    DIR_URL_CARTS: '/carts',
    DIR_URL_USERS: '/users',
    DIR_URL_DELIVERY: '/delivery',
    USER_NOT_FOUND: 'Usuario no encontrado',
    PRODUCT_NOT_FOUND: 'Producto no encontrado.',
    PURCHASE_NOT_FOUND: 'Compra no encontrada.',
    USER_CREATE_NOT_PASSWORD: 'Se debe ingresar una contraseña al crear un usuario.',
    BAD_ID: 'El ID no tiene formato válido.',
    SERVER_ERROR: 'Error interno del servidor.',
    ROUTE_NOT_FOUND: 'Ruta no encontrada',
    PRODUCT_CREATE_MUST_BE_ARRAY: 'El body debe ser un array.',
    REQUEST_NOT_COMPLETE: 'Solicitud incompleta.',
    QUANTITY_NOT_DEFINED: 'No se encontró el campo "quantity" en el cuerpo de la solicitud.',
    QUANTITY_INVALID_VALUE: 'Cantidad no válida.',
    VALIDATION_FAILED: 'Validación fallida.',
    MOCK_QUANTITY_INVALID: 'Cantidad de mocks inválida.',
    MOCK_INSERT_FAILED: 'Error al guardar los mocks en la base de datos.',
    MOCKS_NO_PRODUCTS: 'No hay productos disponibles para generar carritos mock.',
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
    },
    USER_CREATE_ALLOWED_FIELDS: [
        "name",
        "last_name",
        "email",
        "password",
        "status",
        "role"
    ],
    USER_EDIT_ALLOWED_FIELDS: [
        "name",
        "last_name",
        "status",
        "role"
    ],
    USER_FIELDS_SCHEMA: {
        name: "string",
        last_name: "string",
        email: "string",
        password: "string",
        status: "boolean",
        role: "array:string"
    },
    USER_ROLES: [
        'admin',
        'user',
        'seller',
        'dealer'
    ],
    ORDER_STATES: [
        'pending',
        'confirmed',
        'shipped',
        'delivered'
    ],
    ORDER_PRIORITIES: [
        'low',
        'medium',
        'high'
    ]
})
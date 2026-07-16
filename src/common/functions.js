import { CONSTANTS as CONST } from './constants.js'

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function startupServer(BASEURL) {
    await sleep(100)
    console.log(`Iniciando servidor en 3..`)
    await sleep(500)
    console.log(`Iniciando servidor en 2..`)
    await sleep(500)
    console.log(`Iniciando servidor en 1..`)
    await sleep(500)
    console.log(`Servidor iniciado en: ${BASEURL}`)
}

export function validateFields(objeto, allowedFields, schemaFields) {
    const result = {
        objectValid: true,
        fieldsMissing: [],
        fieldsInvalid: [],
        fieldsTypeError: []
    }
    for (const key in objeto) {
        if (!allowedFields.includes(key)) {
            result.fieldsInvalid.push(key)
        }
    }
    for (const field of allowedFields) {
        if (objeto.hasOwnProperty(field)) {
            const expectedType = schemaFields[field]
            const value = objeto[field]

            switch (expectedType) {
                case "string":
                    if (typeof value !== "string") {
                        result.fieldsTypeError.push(field)
                    }
                    break
                case "number":
                    if (typeof value !== "number") {
                        result.fieldsTypeError.push(field)
                    }
                    break
                case "integer":
                    if (typeof value !== "number" || !Number.isInteger(value)) {
                        result.fieldsTypeError.push(field)
                    }
                    break
                case "boolean":
                    if (typeof value !== "boolean") {
                        result.fieldsTypeError.push(field)
                    }
                    break
                case "array:string":
                    if (!Array.isArray(value) || !value.every(v => typeof v === "string")) { //Aca hay magia!! Recorro el array y encima dentro valido que sea un string.
                        result.fieldsTypeError.push(field)
                    }
                    break
            }
        } else {
            result.fieldsMissing.push(field);
        }
    }
    if (result.fieldsMissing.length > 0 || result.fieldsTypeError.length > 0) {
        result.objectValid = false;
    }
    return result
}

export function validateCartItem(item) {
  const result = validateFields(item, CONST.CART_CREATE_ALLOWED_FIELDS, CONST.CART_FIELDS_SCHEMA)

  if (!result.objectValid) {
    let msg = ''
    if (result.fieldsMissing.length > 0) {
      msg += `Faltan campos: ${result.fieldsMissing.map(f => `'${f}'`).join(", ")}. `
    }
    if (result.fieldsTypeError.length > 0) {
      msg += `Campos con tipo incorrecto: ${result.fieldsTypeError.map(f => `'${f}'`).join(", ")}.`
    }
    return { error: msg.trim() }
  }

  if (result.fieldsInvalid.length > 0) {
    const msg = result.fieldsInvalid.length === 1
      ? `El campo '${result.fieldsInvalid[0]}' estaba de más para el productoId '${item.productId}'.`
      : `Los campos ${result.fieldsInvalid.map(f => `'${f}'`).join(", ")} estaban de más para el productoId '${item.productId}'.`
    return { extraFieldsMsg: msg }
  }

  return {}
}

export function validateQuantity(item) {
  const { productId, quantity } = item
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return `Cantidad inválida para el producto ${productId}. Debe ser un entero mayor a 0.`
  }
  return null
}

export function addOrUpdateCartProduct(productsMap, product, quantity) {
  if (!productsMap[product._id]) {
    productsMap[product._id] = { product: product._id, quantity }
  } else {
    productsMap[product._id].quantity += quantity
  }
}
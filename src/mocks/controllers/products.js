import { generateMockProducts, saveMockProducts } from '../services/products.js'

export async function getMockProducts(req, res) {
  const quantity = parseInt(req.query.quantity) || 10
  const products = generateMockProducts(quantity)
  res.json(products)
}

export async function insertMockProducts(req, res) {
  const quantity = parseInt(req.query.quantity) || 10
  const products = generateMockProducts(quantity)
  const inserted = await saveMockProducts(products)
  res.json({ insertedQuantity: inserted.length })
}
import { generateMockCarts, saveMockCarts } from '../services/carts.js'

export async function getMockCarts(req, res) {
  const quantity = parseInt(req.query.quantity) || 10
  const carts = generateMockCarts(quantity)
  res.json(carts)
}

export async function insertMockCarts(req, res) {
  const quantity = parseInt(req.query.quantity) || 10
  const inserted = await saveMockCarts(quantity)
  res.json({ insertedCount: inserted.length })
}
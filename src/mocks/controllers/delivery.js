import { generateMockDeliveries, saveMockDeliveries } from '../services/delivery.js'

export async function getMockDeliveries(req, res) {
  const quantity = parseInt(req.query.quantity) || 10
  const deliveries = await generateMockDeliveries(quantity)
  res.json(deliveries)
}

export async function insertMockDeliveries(req, res) {
  const quantity = parseInt(req.query.quantity) || 10
  const inserted = await saveMockDeliveries(quantity)
  res.json({ insertedCount: inserted.length })
}
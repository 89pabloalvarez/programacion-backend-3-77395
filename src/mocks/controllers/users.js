import { generateMockUsers, saveMockUsers } from '../services/users.js'

export async function getMockUsers(req, res) {
  const quantity = parseInt(req.query.quantity) || 10
  const users = generateMockUsers(quantity)
  res.json(users)
}

export async function insertMockUsers(req, res) {
  const quantity = parseInt(req.query.quantity) || 10
  const users = generateMockUsers(quantity)
  const inserted = await saveMockUsers(users)
  res.json({ insertedQuantity: inserted.length })
}
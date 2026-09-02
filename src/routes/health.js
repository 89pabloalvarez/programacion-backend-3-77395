import { Router } from 'express'
import mongoose from 'mongoose'
import { CONSTANTS as CONST } from '../common/constants.js'

const router = Router()

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Estado de salud de la API
 *     description: >
 *       Endpoint simple para health checks (usado por Docker/orquestadores).
 *       No expone información sensible (sin URIs de conexión, credenciales
 *       ni variables de entorno).
 *     responses:
 *       200:
 *         description: La API está operativa.
 *         content:
 *           application/json:
 *             example:
 *               status: 'ok'
 *               environment: 'production'
 *               uptime: 123.45
 *               timestamp: '2025-01-01T00:00:00.000Z'
 *               database: 'connected'
 */
router.get('/', (req, res) => {
  const databaseStates = ['disconnected', 'connected', 'connecting', 'disconnecting']

  res.json({
    status: 'ok',
    environment: CONST.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: databaseStates[mongoose.connection.readyState] || 'unknown'
  })
})

export default router
import { Router } from 'express'
import logger from '../config/logger.js'

const router = Router()

/**
 * @swagger
 * /logger/test:
 *   get:
 *     tags: [Logger]
 *     summary: Endpoint interno para validar la configuración del logger
 *     description: Este endpoint no representa funcionalidad de negocio; sirve para generar logs de prueba en todos los niveles.
 *     responses:
 *       200:
 *         description: Logs generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/test', (req, res) => {
  logger.debug('Prueba de nivel debug del logger')
  logger.http('Prueba de nivel http del logger')
  logger.info('Prueba de nivel info del logger')
  logger.warn('Prueba de nivel warning del logger')
  logger.error('Prueba de nivel error del logger')
  logger.fatal('Prueba de nivel fatal del logger')

  res.json({ success: true, message: 'Logs de prueba generados correctamente.' })
})

export default router

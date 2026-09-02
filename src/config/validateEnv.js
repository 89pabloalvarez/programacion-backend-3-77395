import logger from './logger.js'

const REQUIRED_ENV_VARS = [
  'MONGO_USER',
  'MONGO_PASS',
  'MONGO_CLUSTER',
  'MONGO_DB_NAME',
  'MONGO_SHARD',
  'MONGO_ATLAS_SHARD'
]

export const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => {
    const value = process.env[key]
    return value === undefined || value === null || value.trim() === ''
  })

  if (missing.length > 0) {
    const message = `Faltan variables de entorno obligatorias: ${missing.join(', ')}. ` +
      'Revisá tu archivo .env (ver .env.example) antes de levantar el servidor.'
    logger.fatal(message, { missing })
    console.error(`\n ${message}\n`)
    process.exit(1)
  }
}
import logger from './logger.js'

const ATLAS_ENV_VARS = [
  'MONGO_USER',
  'MONGO_PASS',
  'MONGO_CLUSTER',
  'MONGO_DB_NAME',
  'MONGO_SHARD',
  'MONGO_ATLAS_SHARD'
]

const isBlank = (value) => value === undefined || value === null || value.trim() === ''

export const validateEnv = () => {
  const hasMongoUri = !isBlank(process.env.MONGO_URI)
  const missingAtlasVars = ATLAS_ENV_VARS.filter((key) => isBlank(process.env[key]))

  if (!hasMongoUri && missingAtlasVars.length > 0) {
    const message = 'No hay forma de conectar a MongoDB: definí MONGO_URI (Mongo local/docker-compose) ' +
      `o completá las variables de Atlas faltantes: ${missingAtlasVars.join(', ')}. ` +
      'Revisá tu archivo .env (ver .env.example) antes de levantar el servidor.'
    logger.fatal(message, { missingAtlasVars })
    console.error(`\n ${message}\n`)
    process.exit(1)
  }
}

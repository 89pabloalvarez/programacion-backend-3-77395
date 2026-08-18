import mongoose from 'mongoose'
import dotenv from 'dotenv'
import logger from './logger.js'

// Switcheo del ambiente, si es testing va por un ldao y si es de ejecución "normal" va por .env.
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
dotenv.config({ path: envFile })

const uri = `mongodb://`
    + `${process.env.MONGO_USER}:${process.env.MONGO_PASS}`
    + `@ac-${process.env.MONGO_SHARD}-00-00.${process.env.MONGO_CLUSTER}:27017,`
    + `ac-${process.env.MONGO_SHARD}-00-01.${process.env.MONGO_CLUSTER}:27017,`
    + `ac-${process.env.MONGO_SHARD}-00-02.${process.env.MONGO_CLUSTER}:27017/`
    + `?ssl=true`
    + `&replicaSet=atlas-${process.env.MONGO_ATLAS_SHARD}-0`
    + `&authSource=admin`
    + `&retryWrites=true`
    + `&w=majority`
    + `&appName=${process.env.MONGO_DB_NAME}`

const mongoConnection = async () => {
    logger.info('Iniciando la conexión a la DB...')
    try {
        await mongoose.connect(uri, { dbName: `${process.env.MONGO_DB_NAME}` })
        logger.info('Conexión a la DB completada satisfactoriamente.')
    } catch (err) {
        logger.fatal('Error al establecer la conexión a la DB', { error: err.message, stack: err.stack })
    }
}

export default mongoConnection
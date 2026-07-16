import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

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
    console.log('Iniciando la conexión a la DB...')
    try {
        await mongoose.connect(uri, { dbName: `${process.env.MONGO_DB_NAME}` })
        console.log('Conexión a la DB completada satisfactoriamente.')
    } catch (err) {
        console.error('Error al establecer la conexión a la DB: ', err)
    }
}

export default mongoConnection
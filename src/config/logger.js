import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logsDir = path.resolve(__dirname, '../../logs')

fs.mkdirSync(logsDir, { recursive: true })

const customLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5
}

const isProduction = process.env.NODE_ENV === 'production'
const logLevel = isProduction ? 'info' : 'debug'

const consoleTransport = new winston.transports.Console({
  level: logLevel,
  format: winston.format.simple()
})

const combinedTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: logLevel
})

const errorTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error'
})

const logger = winston.createLogger({
  levels: customLevels,
  level: logLevel,
  transports: [consoleTransport, combinedTransport, errorTransport]
})

logger.warning = (message, meta) => logger.log('warn', message, meta)
logger.warn = logger.warning
logger.http = (message, meta) => logger.log('http', message, meta)

export default logger

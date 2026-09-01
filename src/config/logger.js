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
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
}

const isProduction = process.env.NODE_ENV === 'production'

const logLevel = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug')

winston.addColors({
  fatal: 'magenta',
  error: 'red',
  warning: 'yellow',
  info: 'green',
  http: 'cyan',
  debug: 'blue'
})

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) =>
    `${timestamp} [${level}] ${message}${Object.keys(meta).length ? ' ' + JSON.stringify(meta) : ''}`
  )
)

const consoleTransport = new winston.transports.Console({
  level: logLevel,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    logFormat
  )
})

const combinedTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: logLevel,
  format: logFormat
})

const errorTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
  format: logFormat
})

const logger = winston.createLogger({
  levels: customLevels,
  level: logLevel,
  transports: [consoleTransport, combinedTransport, errorTransport]
})

logger.warning = (message, meta) => logger.log('warning', message, meta)
logger.warn = logger.warning
logger.http = (message, meta) => logger.log('http', message, meta)

export default logger

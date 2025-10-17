import pino from 'pino'

const isDev = (process.env.NODE_ENV || 'development') === 'development'
const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? { target: 'pino-pretty', options: { colorize: true, singleLine: false } }
    : undefined
})

export default logger

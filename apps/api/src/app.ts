import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

import applicantsRouter from './routes/applicants'
import jobsRouter from './routes/jobs'
import interviewRouter from './routes/interview'
import emailsRouter from './routes/emails'
import webhooksRouter from './routes/webhooks'
import calendarRouter from './routes/calendar'
import matchRouter from './routes/match'
import assessmentsRouter from './routes/assessments'

const app = express()

// Middlewares
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 })
app.use(limiter)

// Routes
app.use('/api/applicants', applicantsRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/interview', interviewRouter)
app.use('/api/emails', emailsRouter)
app.use('/api/webhooks', webhooksRouter)
app.use('/api/calendar', calendarRouter)
app.use('/api/match', matchRouter)
app.use('/api/assessments', assessmentsRouter)

// health and metrics endpoint placeholder
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// generic error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  console.error('Unhandled error', err?.stack ?? err)
  res.status(err?.status || 500).json({ error: err?.message || 'Internal Server Error' })
})

export default app

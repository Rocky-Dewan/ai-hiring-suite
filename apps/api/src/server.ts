import dotenv from 'dotenv'
import 'dotenv/config'
import http from 'http'
import app from './app'

import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`API server listening on http://0.0.0.0:${PORT}`)
})

server.on('error', (err) => {
  console.error('Server error', err)
  process.exit(1)
})

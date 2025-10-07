import { serve } from '@hono/node-server'
import { config } from 'dotenv'
import app from './index'

config()

const PORT = Number(process.env.BACKEND_PORT) || 8000

console.log(`🦊 Hono API v2 is starting up...`)
console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)

serve({
  fetch: app.fetch,
  port: PORT,
})

console.log(`✅ Server is running on http://localhost:${PORT}`)
console.log(`🔍 Health check: http://localhost:${PORT}/health`)
console.log(`📚 API base: http://localhost:${PORT}/api/v1`)

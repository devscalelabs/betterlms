import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { accountRouter } from './v1/router/account'
import { articlesRouter } from './v1/router/articles'
import { authRouter } from './v1/router/auth'
import { channelsRouter } from './v1/router/channels'
import { coursesRouter } from './v1/router/courses'
import { enrollmentsRouter } from './v1/router/enrollments'
import { eventParticipantsRouter } from './v1/router/event-participants'
import { eventsRouter } from './v1/router/events'
import { lessonsRouter } from './v1/router/lessons'
import { linkPreviewRouter } from './v1/router/link-preview'
import { mediaRouter } from './v1/router/media'
import { notificationsRouter } from './v1/router/notifications'
import { postsRouter } from './v1/router/posts'
import { profileRouter } from './v1/router/profile'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: ["http://localhost:3000", "http://localhost:4000"],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// API v1 routes
app.route('/api/v1', authRouter)
app.route('/api/v1', accountRouter)
app.route('/api/v1', articlesRouter)
app.route('/api/v1', channelsRouter)
app.route('/api/v1', coursesRouter)
app.route('/api/v1', enrollmentsRouter)
app.route('/api/v1', lessonsRouter)
app.route('/api/v1', mediaRouter)
app.route('/api/v1', notificationsRouter)
app.route('/api/v1', postsRouter)
app.route('/api/v1', profileRouter)
app.route('/api/v1', linkPreviewRouter)
app.route('/api/v1', eventsRouter)
app.route('/api/v1', eventParticipantsRouter)


// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message
    },
    500
  )
})

export default app

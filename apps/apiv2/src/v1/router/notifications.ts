import {
  findNotificationsByRecipient,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  verifyToken,
} from '@betterlms/core'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const notificationsRouter = new Hono()

notificationsRouter.get('/notifications', async (c) => {
  const token = c.req.header('authorization')?.split(' ')[1]

  if (!token) {
    return c.json({
      error: 'Unauthorized',
    }, 401)
  }

  const userId = await verifyToken(token)
  const notifications = await findNotificationsByRecipient(userId)

  return c.json({ notifications })
})

notificationsRouter.put(
  '/notifications/:id/read',
  zValidator('param', z.object({
    id: z.string(),
  })),
  async (c) => {
    const token = c.req.header('authorization')?.split(' ')[1]

    if (!token) {
      return c.json({
        error: 'Unauthorized',
      }, 401)
    }

    const userId = await verifyToken(token)
    const result = await markNotificationAsRead(c.req.param('id'), userId)

    if (result.count === 0) {
      return c.json({
        error: 'Notification not found or already marked as read',
      }, 404)
    }

    return c.json({ message: 'Notification marked as read' })
  },
)

notificationsRouter.put('/notifications/read-all', async (c) => {
  const token = c.req.header('authorization')?.split(' ')[1]

  if (!token) {
    return c.json({
      error: 'Unauthorized',
    }, 401)
  }

  const userId = await verifyToken(token)
  const result = await markAllNotificationsAsRead(userId)

  return c.json({
    message: `Marked ${result.count} notifications as read`,
  })
})

export { notificationsRouter }

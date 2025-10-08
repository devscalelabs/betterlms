import {
  createEventParticipant,
  deleteEventParticipant,
  findEventParticipantByUserAndEvent,
  findEventParticipants,
  verifyToken,
} from '@betterlms/core'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const eventParticipantsRouter = new Hono()

eventParticipantsRouter.get(
  '/event-participants',
  zValidator('query', z.object({
    userId: z.string().optional(),
    eventId: z.string().optional(),
  })),
  async (c) => {
    const query = c.req.valid('query')
    const participants = await findEventParticipants({
      ...(query.userId && { userId: query.userId }),
      ...(query.eventId && { eventId: query.eventId }),
    })

    return c.json({ participants })
  },
)

eventParticipantsRouter.get('/event-participants/my-participations', async (c) => {
  const token = c.req.header('authorization')?.split(' ')[1]

  if (!token) {
    return c.json({
      error: 'Unauthorized',
    }, 401)
  }

  const userId = await verifyToken(token)
  const participants = await findEventParticipants({ userId })

  return c.json({ participants })
})

eventParticipantsRouter.post(
  '/event-participants',
  zValidator('json', z.object({
    eventId: z.string(),
  })),
  async (c) => {
    const token = c.req.header('authorization')?.split(' ')[1]

    if (!token) {
      return c.json({
        error: 'Unauthorized',
      }, 401)
    }

    const userId = await verifyToken(token)
    const body = c.req.valid('json')
    const { eventId } = body

    try {
      const participant = await createEventParticipant({
        userId,
        eventId,
      })

      return c.json({ participant }, 201)
    } catch (error) {
      if (error instanceof Error && error.message === 'User is already participating in this event') {
        return c.json({
          error: 'Already participating in this event',
        }, 409)
      }
      throw error
    }
  },
)

eventParticipantsRouter.delete(
  '/event-participants',
  zValidator('query', z.object({
    eventId: z.string(),
  })),
  async (c) => {
    const token = c.req.header('authorization')?.split(' ')[1]

    if (!token) {
      return c.json({
        error: 'Unauthorized',
      }, 401)
    }

    const userId = await verifyToken(token)
    const query = c.req.valid('query')
    const { eventId } = query

    const participant = await findEventParticipantByUserAndEvent(userId, eventId)

    if (!participant) {
      return c.json({
        error: 'Participation not found',
      }, 404)
    }

    await deleteEventParticipant(userId, eventId)

    return c.json({ message: 'Participation removed successfully' })
  },
)

export { eventParticipantsRouter }

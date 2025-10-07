import {
  addChannelMember,
  createChannel,
  findChannelById,
  findChannelMember,
  findPublicChannels,
  removeChannelMember,
  verifyToken,
} from '@betterlms/core'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const channelsRouter = new Hono()

channelsRouter.get('/channels/', async (c) => {
  const channels = await findPublicChannels()
  return c.json({ channels })
})

channelsRouter.post(
  '/channels/',
  zValidator('json', z.object({
    name: z.string().min(1).max(100),
    isPrivate: z.boolean().optional(),
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
    const { name, isPrivate } = body

    const channel = await createChannel(name, isPrivate || false)
    await addChannelMember(userId, channel.id)

    return c.json({ channel }, 201)
  },
)

channelsRouter.get('/channels/:id', async (c) => {
  const token = c.req.header('authorization')?.split(' ')[1]

  if (!token) {
    return c.json({
      error: 'Unauthorized',
    }, 401)
  }

  const userId = await verifyToken(token)
  const channel = await findChannelById(c.req.param('id'))

  if (!channel) {
    return c.json({
      error: 'Channel not found',
    }, 404)
  }

  const isMember = channel.members.some(
    (member: { userId: string }) => member.userId === userId,
  )

  if (channel.isPrivate && !isMember) {
    return c.json({
      error: 'Access denied',
    }, 403)
  }

  return c.json({ channel })
})

channelsRouter.post('/channels/:id/join', async (c) => {
  const token = c.req.header('authorization')?.split(' ')[1]

  if (!token) {
    return c.json({
      error: 'Unauthorized',
    }, 401)
  }

  const userId = await verifyToken(token)
  const channel = await findChannelById(c.req.param('id'))

  if (!channel) {
    return c.json({
      error: 'Channel not found',
    }, 404)
  }

  const existingMember = await findChannelMember(userId, c.req.param('id'))

  if (existingMember) {
    return c.json({
      error: 'Already a member of this channel',
    }, 409)
  }

  const member = await addChannelMember(userId, c.req.param('id'))

  return c.json({ member }, 201)
})

channelsRouter.delete('/channels/:id/leave', async (c) => {
  const token = c.req.header('authorization')?.split(' ')[1]

  if (!token) {
    return c.json({
      error: 'Unauthorized',
    }, 401)
  }

  const userId = await verifyToken(token)
  await removeChannelMember(userId, c.req.param('id'))

  return c.json({ message: 'Left channel successfully' })
})

export { channelsRouter }

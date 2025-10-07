import { findUserById, verifyToken } from '@betterlms/core'
import { Hono } from 'hono'

const accountRouter = new Hono()

accountRouter.get('/account/', async (c) => {
  const token = c.req.header('authorization')?.split(' ')[1]

  if (!token) {
    return c.json({
      error: 'Unauthorized',
    }, 401)
  }

  try {
    const userId = await verifyToken(token)
    const user = await findUserById(userId)

    if (!user) {
      return c.json({
        error: 'User not found',
      }, 404)
    }

    if (user.isSuspended) {
      return c.json({
        error:
          'Your account has been suspended. Please contact support for assistance.',
      }, 403)
    }

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        imageUrl: user.imageUrl,
        role: user.role,
      },
    })
  } catch (error) {
    return c.json({
      error: `${error}`,
    }, 401)
  }
})

export { accountRouter }

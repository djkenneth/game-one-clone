import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import type { User } from '@prisma/client'
import { prisma } from '../index'
import { ForbiddenError, UnauthorizedError } from '../utils/errors'

export type AuthEnv = {
  Variables: {
    user: User
  }
}

/**
 * Verifies the JWT Bearer token and attaches the User to context.
 * Throws UnauthorizedError if token is missing, invalid, or user not found.
 */
export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authorization = c.req.header('Authorization')
  const bearer = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null

  if (!bearer) {
    throw new UnauthorizedError('No token provided')
  }

  try {
    const payload = await verify(bearer, process.env.JWT_SECRET!, 'HS256')

    if (!payload?.userId) {
      throw new UnauthorizedError('Invalid token')
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as number },
    })

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    c.set('user', user)
    await next()
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error
    throw new UnauthorizedError('Invalid token')
  }
})

/**
 * Enforces ADMIN role. Must be used after authMiddleware.
 * Throws ForbiddenError if user is not an ADMIN.
 */
export const isAdminMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const user = c.get('user')
  if (!user || user.role !== 'ADMIN') {
    throw new ForbiddenError('Admin access required')
  }
  await next()
})

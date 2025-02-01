import { Elysia } from 'elysia'
import { prisma } from '../index'
import { UnauthorizedError } from '../utils/errors'

export const auth = new Elysia()
  .derive(async ({ bearer, jwt, request, set }) => {
    // Skip authentication for public routes
    const publicPaths = [
      '/swagger',
      '/docs',
      '/api/auth/login',
      '/api/auth/signup',
      '/'
    ]
    
    const path = new URL(request.url).pathname
    if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
      return
    }

    if (!bearer) {
      throw new UnauthorizedError('No token provided')
    }

    try {
      const payload = await jwt.verify(bearer)
      if (!payload?.userId) {
        throw new UnauthorizedError('Invalid token')
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      })

      if (!user) {
        throw new UnauthorizedError('User not found')
      }

      return { user }
    } catch (error) {
      throw new UnauthorizedError('Invalid token')
    }
  })

export const isAdmin = async ({ user, set }) => {
  if (user.role !== 'ADMIN') {
    set.status = 403
    throw new Error('Forbidden: Admin access required')
  }
}
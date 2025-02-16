import { type Elysia } from 'elysia'
import { prisma } from '../index'
import { UnauthorizedError } from '../utils/errors'
import bearer from '@elysiajs/bearer'
import jwt from '@elysiajs/jwt'

export const auth = (app: Elysia) => app
  .use(bearer())
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET!
  }))
  .derive(async ({ bearer, jwt }) => {
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

// Middleware to check if user is authenticated
export const isAuth = async ({ user, set }) => {
  if (!user) {
    throw new UnauthorizedError('Authentication required')
  }
}

// Middleware to check if user is admin
export const isAdmin = async ({ user, set }) => {
  if (!user || user.role !== 'ADMIN') {
    throw new UnauthorizedError('Admin access required')
  }
}
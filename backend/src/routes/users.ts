// src/routes/users.ts

import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { auth, isAdmin } from '../plugins/auth'
import { AddressSchema, ProfileSchema, UpdateUserSchema } from '../schema/users'
import { BadRequestError, NotFoundError } from '../utils/errors'

export const userRouter = new Elysia({ prefix: '/users' })
  .use(auth)

  // Address routes
  .group('/address', app => app
    // Create address
    .post('/',
      async ({ body, user }) => {
        const address = await prisma.address.create({
          data: {
            ...AddressSchema.parse(body),
            userId: user.id
          }
        })

        return { address }
      }
    )

    // List addresses
    .get('/',
      async ({ user }) => {
        const addresses = await prisma.address.findMany({
          where: { userId: user.id }
        })

        return { addresses }
      }
    )

    // Delete address
    .delete('/:id',
      async ({ params: { id }, user }) => {
        try {
          const address = await prisma.address.findFirst({
            where: { 
              id: parseInt(id),
              userId: user.id
            }
          })

          if (!address) {
            throw new NotFoundError('Address not found')
          }

          await prisma.address.delete({
            where: { id: parseInt(id) }
          })

          return { success: true }
        } catch (error) {
          throw new NotFoundError('Address not found')
        }
      }
    )
  )

  // Profile routes
  .group('/profile', app => app
    // Create profile
    .post('/',
      async ({ body, user }) => {
        const profile = await prisma.profile.create({
          data: {
            ...ProfileSchema.parse(body),
            userId: user.id
          }
        })

        return { profile }
      }
    )

    // Get profile
    .get('/',
      async ({ user }) => {
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id }
        })

        if (!profile) {
          throw new NotFoundError('Profile not found')
        }

        return { profile }
      }
    )

    // Update profile
    .put('/',
      async ({ body, user }) => {
        try {
          const profile = await prisma.profile.update({
            where: { userId: user.id },
            data: ProfileSchema.parse(body)
          })

          return { profile }
        } catch (error) {
          throw new NotFoundError('Profile not found')
        }
      }
    )
  )

  // Update user
  .put('/',
    async ({ body, user }) => {
      const data = UpdateUserSchema.parse(body)

      if (data.defaultShippingAddress) {
        const address = await prisma.address.findFirst({
          where: { 
            id: data.defaultShippingAddress,
            userId: user.id
          }
        })

        if (!address) {
          throw new BadRequestError('Invalid shipping address')
        }
      }

      if (data.defaultBillingAddress) {
        const address = await prisma.address.findFirst({
          where: { 
            id: data.defaultBillingAddress,
            userId: user.id
          }
        })

        if (!address) {
          throw new BadRequestError('Invalid billing address')
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data
      })

      return { user: updatedUser }
    }
  )

  // Admin routes
  .group('/admin', app => app
    .onBeforeHandle(isAdmin)

    // List users
    .get('/',
      async ({ query }) => {
        const { skip = '0', take = '10' } = query

        const users = await prisma.user.findMany({
          skip: parseInt(skip as string),
          take: parseInt(take as string),
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        })

        const total = await prisma.user.count()

        return { 
          users,
          total,
          page: Math.floor(parseInt(skip as string) / parseInt(take as string)) + 1,
          pageSize: parseInt(take as string)
        }
      }
    )

    // Get user by ID
    .get('/:id',
      async ({ params: { id } }) => {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id) },
          include: {
            addresses: true,
            profile: true
          }
        })

        if (!user) {
          throw new NotFoundError('User not found')
        }

        return { user }
      }
    )

    // Change user role
    .put('/:id/role',
      async ({ params: { id }, body }) => {
        try {
          const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
              role: body.role
            }
          })

          return { user }
        } catch (error) {
          throw new NotFoundError('User not found')
        }
      },
      {
        body: t.Object({
          role: t.Enum({ ADMIN: 'ADMIN', USER: 'USER' })
        })
      }
    )
  )
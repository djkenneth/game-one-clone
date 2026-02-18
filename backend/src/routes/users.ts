import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../index'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../plugins/auth'
import { NotFoundError, UnauthorizedError } from '../utils/errors'
import { AddressSchema, ProfileInputSchema, UpdateRoleSchema } from '../schema/users'

export const userRouter = new Hono<AuthEnv>()

// ─── Profile Routes ───────────────────────────────────────────────────────────

const profileRouter = new Hono<AuthEnv>()
profileRouter.use('*', authMiddleware)

profileRouter.post('/', zValidator('json', ProfileInputSchema), async (c) => {
  const user = c.get('user')
  const body = c.req.valid('json')

  const profileData = {
    firstName: body.firstName,
    middleName: body.middleName,
    lastName: body.lastName,
    birthDate: new Date(body.birthDate),
    age: parseInt(body.age),
    profilePicture: body.profilePicture,
    userId: user.id,
  }

  const profile = await prisma.profile.create({ data: profileData })

  return c.json({ success: true, data: { profile } })
})

profileRouter.get('/', async (c) => {
  const user = c.get('user')

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })

  if (!profile) {
    throw new NotFoundError('Profile not found')
  }

  return c.json({ success: true, data: { profile } })
})

profileRouter.put('/', zValidator('json', ProfileInputSchema), async (c) => {
  const user = c.get('user')
  const body = c.req.valid('json')

  try {
    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        firstName: body.firstName,
        middleName: body.middleName,
        lastName: body.lastName,
        birthDate: new Date(body.birthDate),
        age: parseInt(body.age),
        profilePicture: body.profilePicture,
      },
    })

    return c.json({ success: true, data: { profile } })
  } catch {
    throw new NotFoundError('Profile not found')
  }
})

userRouter.route('/profile', profileRouter)

// ─── Address Routes ───────────────────────────────────────────────────────────

const addressRouter = new Hono<AuthEnv>()
addressRouter.use('*', authMiddleware)

addressRouter.post('/', zValidator('json', AddressSchema), async (c) => {
  const user = c.get('user')
  const body = c.req.valid('json')

  const address = await prisma.address.create({
    data: {
      lineOne: body.lineOne,
      lineTwo: body.lineTwo,
      city: body.city,
      country: body.country,
      pincode: body.pincode,
      userId: user.id,
    },
  })

  return c.json({ success: true, data: { address } })
})

addressRouter.get('/', async (c) => {
  const user = c.get('user')

  const addresses = await prisma.address.findMany({ where: { userId: user.id } })

  return c.json({ success: true, data: { addresses } })
})

addressRouter.delete('/:id', async (c) => {
  const user = c.get('user')
  const id = parseInt(c.req.param('id'))

  const address = await prisma.address.findFirst({
    where: { id, userId: user.id },
  })

  if (!address) {
    throw new NotFoundError('Address not found')
  }

  await prisma.address.delete({ where: { id } })

  return c.json({ success: true, message: 'Address deleted successfully' })
})

addressRouter.put('/:id', zValidator('json', AddressSchema), async (c) => {
  const user = c.get('user')
  const id = parseInt(c.req.param('id'))
  const body = c.req.valid('json')

  const existing = await prisma.address.findFirst({ where: { id, userId: user.id } })

  if (!existing) {
    throw new NotFoundError('Address not found')
  }

  const updatedAddress = await prisma.address.update({
    where: { id },
    data: {
      lineOne: body.lineOne,
      lineTwo: body.lineTwo,
      city: body.city,
      country: body.country,
      pincode: body.pincode,
    },
  })

  return c.json({ success: true, data: { address: updatedAddress } })
})

userRouter.route('/address', addressRouter)

// ─── Admin Routes ─────────────────────────────────────────────────────────────

const adminRouter = new Hono<AuthEnv>()
adminRouter.use('*', authMiddleware, isAdminMiddleware)

adminRouter.get(
  '/',
  zValidator('query', z.object({ skip: z.string().optional(), take: z.string().optional() })),
  async (c) => {
    const { skip = '0', take = '10' } = c.req.valid('query')

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: parseInt(skip),
        take: parseInt(take),
        select: { id: true, email: true, role: true, createdAt: true },
      }),
      prisma.user.count(),
    ])

    return c.json({
      success: true,
      data: {
        users,
        total,
        page: Math.floor(parseInt(skip) / parseInt(take)) + 1,
        pageSize: parseInt(take),
      },
    })
  }
)

adminRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))

  const user = await prisma.user.findUnique({
    where: { id },
    include: { addresses: true, profile: true },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return c.json({ success: true, data: { user } })
})

adminRouter.put('/:id/role', zValidator('json', UpdateRoleSchema), async (c) => {
  const id = parseInt(c.req.param('id'))
  const { role } = c.req.valid('json')

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    })

    return c.json({ success: true, data: { user } })
  } catch {
    throw new NotFoundError('User not found')
  }
})

userRouter.route('/admin', adminRouter)

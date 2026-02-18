import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { compareSync, hashSync } from 'bcrypt'
import { sign } from 'hono/jwt'
import { z } from 'zod'
import { prisma } from '../index'
import { SignUpSchema } from '../schema/users'
import { BadRequestError, UnauthorizedError } from '../utils/errors'
import { authMiddleware, type AuthEnv } from '../plugins/auth'

const SALT_ROUNDS = 10

export const authRouter = new Hono<AuthEnv>()

// Signup
authRouter.post(
  '/signup',
  zValidator('json', SignUpSchema),
  async (c) => {
    const { email, password, name } = c.req.valid('json')

    const existingUser = await prisma.user.findFirst({ where: { email } })

    if (existingUser) {
      throw new BadRequestError('User already exists')
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashSync(password, SALT_ROUNDS),
      },
    })

    return c.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  }
)

// Login
authRouter.post(
  '/login',
  zValidator(
    'json',
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (c) => {
    const { email, password } = c.req.valid('json')

    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const accessToken = await sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!
    )

    return c.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    })
  }
)

// Get current user profile
authRouter.get('/me', authMiddleware, async (c) => {
  const user = c.get('user')

  const userWithDetails = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      addresses: true,
    },
  })

  if (!userWithDetails) {
    throw new UnauthorizedError('User not found')
  }

  return c.json({
    success: true,
    data: { user: userWithDetails },
  })
})

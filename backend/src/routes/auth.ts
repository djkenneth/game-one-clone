import { compareSync, hashSync } from 'bcrypt'
import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { auth } from '../plugins/auth'
import { SignUpSchema } from '../schema/users'
import { BadRequestError, UnauthorizedError } from '../utils/errors'

const SALT_ROUNDS = 10

export const authRouter = new Elysia({ prefix: '/auth' })
  // Signup
  .post('/signup', 
    async ({ body }) => {
      const validated = SignUpSchema.parse(body)
      const { email, password, name } = validated

      const existingUser = await prisma.user.findFirst({ 
        where: { email } 
      })

      if (existingUser) {
        throw new BadRequestError('User already exists')
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashSync(password, SALT_ROUNDS)
        }
      })

      return { 
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
        name: t.String()
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Create a new user account with email and password'
      }
    }
  )

  // Login
  .post('/login',
    async ({ body, jwt }) => {
      const { email, password } = body

      const user = await prisma.user.findFirst({ 
        where: { email } 
      })

      if (!user) {
        throw new UnauthorizedError('Invalid credentials')
      }

      if (!compareSync(password, user.password)) {
        throw new UnauthorizedError('Invalid credentials')
      }

      const accessToken = await jwt.sign({ 
        userId: user.id 
      })

      return { 
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String()
      }),
      detail: {
        tags: ['Authentication'],
        summary: 'User login',
        description: 'Authenticate a user and receive a JWT token',
      }
    }
  )

  // Profile
  .get('/me',
    async ({ user }) => {
      return { user }
    },
    { 
      onBeforeHandle: [auth],
      detail: {
        tags: ['Authentication'],
        summary: 'Get user profile',
        description: 'Get the profile of the currently authenticated user',
        security: [{ bearerAuth: [] }]
      }
    }
  )
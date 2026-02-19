import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { SignUpSchema, LoginSchema } from '../schema/users'
import { authMiddleware, type AuthEnv } from '../plugins/auth'
import { AuthController } from '../controllers/auth.controller'

export const authRouter = new Hono<AuthEnv>()

authRouter.post('/signup', zValidator('json', SignUpSchema), AuthController.signup)
authRouter.post('/login', zValidator('json', LoginSchema), AuthController.login)
authRouter.get('/me', authMiddleware, AuthController.getMe)

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../plugins/auth'
import { UserController } from '../controllers/user.controller'
import {
  CreateProfileSchema,
  UpdateProfileSchema,
  CreateAddressSchema,
  UpdateRoleSchema,
} from '../schema/users'

export const userRouter = new Hono<AuthEnv>()

// ─── Profile Routes ───────────────────────────────────────────────────────────

const profileRouter = new Hono<AuthEnv>()
profileRouter.use('*', authMiddleware)

profileRouter.post('/', zValidator('json', CreateProfileSchema), UserController.createProfile)
profileRouter.get('/', UserController.getProfile)
profileRouter.put('/', zValidator('json', UpdateProfileSchema), UserController.updateProfile)

userRouter.route('/profile', profileRouter)

// ─── Address Routes ───────────────────────────────────────────────────────────

const addressRouter = new Hono<AuthEnv>()
addressRouter.use('*', authMiddleware)

addressRouter.get('/', UserController.getAddresses)
addressRouter.post('/', zValidator('json', CreateAddressSchema), UserController.createAddress)
addressRouter.put('/:id', zValidator('json', CreateAddressSchema), UserController.updateAddress)
addressRouter.delete('/:id', UserController.deleteAddress)

userRouter.route('/address', addressRouter)

// ─── Admin Routes ─────────────────────────────────────────────────────────────

const adminRouter = new Hono<AuthEnv>()
adminRouter.use('*', authMiddleware, isAdminMiddleware)

adminRouter.get(
  '/',
  zValidator('query', z.object({ skip: z.string().optional(), take: z.string().optional() })),
  UserController.listUsers
)
adminRouter.get('/:id', UserController.getUserById)
adminRouter.put('/:id/role', zValidator('json', UpdateRoleSchema), UserController.updateRole)

userRouter.route('/admin', adminRouter)

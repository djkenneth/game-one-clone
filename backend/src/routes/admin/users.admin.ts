import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { AdminUserController } from '../../controllers/admin/users.admin.controller'
import { UpdateRoleSchema } from '../../schema/users'

export const adminUsersRouter = new Hono<AuthEnv>()

adminUsersRouter.get(
  '/',
  zValidator('query', z.object({ skip: z.string().optional(), take: z.string().optional() })),
  AdminUserController.listUsers,
)

adminUsersRouter.get('/:id', AdminUserController.getUserById)

adminUsersRouter.put(
  '/:id/role',
  zValidator('json', UpdateRoleSchema),
  AdminUserController.updateRole,
)

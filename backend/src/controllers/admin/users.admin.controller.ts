import type { Context } from 'hono'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { UserService } from '../../services/user.service'
import type { Role } from '@prisma/client'

type C = Context<AuthEnv>

export const AdminUserController = {
  async listUsers(c: C) {
    const { skip = '0', take = '20' } = c.req.valid('query' as never) as {
      skip?: string
      take?: string
    }
    const s = parseInt(skip)
    const t = parseInt(take)
    const result = await UserService.listUsers(s, t)
    return c.json({
      success: true,
      data: { ...result, page: Math.floor(s / t) + 1, pageSize: t },
    })
  },

  async getUserById(c: C) {
    const id = parseInt(c.req.param('id'))
    const user = await UserService.getUserById(id)
    return c.json({ success: true, data: { user } })
  },

  async updateRole(c: C) {
    const id = parseInt(c.req.param('id'))
    const { role } = c.req.valid('json' as never) as { role: Role }
    const user = await UserService.updateRole(id, role)
    return c.json({ success: true, data: { user } })
  },
}

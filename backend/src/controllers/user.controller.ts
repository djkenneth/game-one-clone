import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { UserService } from '../services/user.service'
import type { Role } from '@prisma/client'

type C = Context<AuthEnv>

export const UserController = {
  // --- Profile ---
  async createProfile(c: C) {
    const user = c.get('user')
    const body = c.req.valid('json' as never) as any
    const profile = await UserService.createProfile(user.id, body)
    return c.json({ success: true, data: { profile } }, 201)
  },

  async getProfile(c: C) {
    const user = c.get('user')
    const profile = await UserService.getProfile(user.id)
    return c.json({ success: true, data: { profile } })
  },

  async updateProfile(c: C) {
    const user = c.get('user')
    const body = c.req.valid('json' as never) as any
    const profile = await UserService.updateProfile(user.id, body)
    return c.json({ success: true, data: { profile } })
  },

  // --- Address ---
  async createAddress(c: C) {
    const user = c.get('user')
    const body = c.req.valid('json' as never) as any
    const address = await UserService.createAddress(user.id, body)
    return c.json({ success: true, data: { address } }, 201)
  },

  async getAddresses(c: C) {
    const user = c.get('user')
    const addresses = await UserService.getAddresses(user.id)
    return c.json({ success: true, data: { addresses } })
  },

  async updateAddress(c: C) {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    const body = c.req.valid('json' as never) as any
    const address = await UserService.updateAddress(id, user.id, body)
    return c.json({ success: true, data: { address } })
  },

  async deleteAddress(c: C) {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    await UserService.deleteAddress(id, user.id)
    return c.json({ success: true, message: 'Address deleted' })
  },

  // --- Admin ---
  async listUsers(c: C) {
    const { skip = '0', take = '10' } = c.req.valid('query' as never) as {
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

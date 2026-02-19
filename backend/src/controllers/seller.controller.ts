import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { SellerService } from '../services/seller.service'

type C = Context<AuthEnv>

export const SellerController = {
  async listShops(c: C) {
    const { page = '1', limit = '10' } = c.req.valid('query' as never) as any
    const result = await SellerService.listShops(parseInt(page), parseInt(limit))
    return c.json({ success: true, data: result })
  },

  async getShop(c: C) {
    const id = parseInt(c.req.param('id'))
    const shop = await SellerService.getShop(id)
    return c.json({ success: true, data: { shop } })
  },

  async createShop(c: C) {
    const user = c.get('user')
    const body = c.req.valid('json' as never) as any
    const shop = await SellerService.createShop(user.id, body)
    return c.json({ success: true, data: { shop } }, 201)
  },

  async updateShop(c: C) {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    const body = c.req.valid('json' as never) as any
    const shop = await SellerService.updateShop(id, user.id, body)
    return c.json({ success: true, data: { shop } })
  },

  async createSellerAccount(c: C) {
    const user = c.get('user')
    const { shopId } = c.req.valid('json' as never) as { shopId: number }
    const account = await SellerService.createSellerAccount(user.id, shopId)
    return c.json({ success: true, data: { account } }, 201)
  },

  async getSellerAccount(c: C) {
    const user = c.get('user')
    const account = await SellerService.getSellerAccount(user.id)
    return c.json({ success: true, data: { account } })
  },
}

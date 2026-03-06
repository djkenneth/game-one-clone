import type { Context } from 'hono'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { SellerService } from '../../services/seller.service'

type C = Context<AuthEnv>

export const AdminSellerController = {
  async listShops(c: C) {
    const { page = '1', limit = '20' } = c.req.valid('query' as never) as {
      page?: string
      limit?: string
    }
    const result = await SellerService.listShops(parseInt(page), parseInt(limit))
    return c.json({ success: true, data: result })
  },

  async getShop(c: C) {
    const id = parseInt(c.req.param('id'))
    const shop = await SellerService.getShop(id)
    return c.json({ success: true, data: { shop } })
  },
}

import type { Context } from 'hono'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { ProductService } from '../../services/product.service'

type C = Context<AuthEnv>

export const AdminCatalogController = {
  // ─── Categories ───────────────────────────────────────────────────────────

  async createCategory(c: C) {
    const body = c.req.valid('json' as never) as any
    const category = await ProductService.createCategory(body)
    return c.json({ success: true, data: { category } }, 201)
  },

  async updateCategory(c: C) {
    const id = parseInt(c.req.param('id'))
    const body = c.req.valid('json' as never) as any
    const category = await ProductService.updateCategory(id, body)
    return c.json({ success: true, data: { category } })
  },

  // ─── Brands ───────────────────────────────────────────────────────────────

  async createBrand(c: C) {
    const body = c.req.valid('json' as never) as any
    const brand = await ProductService.createBrand(body)
    return c.json({ success: true, data: { brand } }, 201)
  },

  async updateBrand(c: C) {
    const id = parseInt(c.req.param('id'))
    const body = c.req.valid('json' as never) as any
    const brand = await ProductService.updateBrand(id, body)
    return c.json({ success: true, data: { brand } })
  },

  async deleteBrand(c: C) {
    const id = parseInt(c.req.param('id'))
    await ProductService.deleteBrand(id)
    return c.json({ success: true, message: 'Brand deleted' })
  },
}

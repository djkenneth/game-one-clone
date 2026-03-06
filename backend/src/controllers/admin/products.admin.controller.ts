import type { Context } from 'hono'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { ProductService } from '../../services/product.service'

type C = Context<AuthEnv>

export const AdminProductController = {
  // ─── Products ─────────────────────────────────────────────────────────────

  async createProduct(c: C) {
    const body = c.req.valid('json' as never) as any
    const product = await ProductService.createProduct(body)
    return c.json({ success: true, data: { product } }, 201)
  },

  async updateProduct(c: C) {
    const id = parseInt(c.req.param('id'))
    const body = c.req.valid('json' as never) as any
    const product = await ProductService.updateProduct(id, body)
    return c.json({ success: true, data: { product } })
  },

  async deleteProduct(c: C) {
    const id = parseInt(c.req.param('id'))
    await ProductService.deleteProduct(id)
    return c.json({ success: true, message: 'Product deleted' })
  },

  // ─── Variants ─────────────────────────────────────────────────────────────

  async createVariant(c: C) {
    const productId = parseInt(c.req.param('productId'))
    const body = c.req.valid('json' as never) as any
    const variant = await ProductService.createVariant(productId, body)
    return c.json({ success: true, data: { variant } }, 201)
  },

  async updateVariant(c: C) {
    const id = parseInt(c.req.param('id'))
    const body = c.req.valid('json' as never) as any
    const variant = await ProductService.updateVariant(id, body)
    return c.json({ success: true, data: { variant } })
  },

  async deleteVariant(c: C) {
    const id = parseInt(c.req.param('id'))
    await ProductService.deleteVariant(id)
    return c.json({ success: true, message: 'Variant deleted' })
  },

  // ─── Images ───────────────────────────────────────────────────────────────

  async addProductImage(c: C) {
    const productId = parseInt(c.req.param('productId'))
    const body = c.req.valid('json' as never) as any
    const image = await ProductService.addProductImage(productId, body)
    return c.json({ success: true, data: { image } }, 201)
  },

  async deleteProductImage(c: C) {
    const id = parseInt(c.req.param('id'))
    await ProductService.deleteProductImage(id)
    return c.json({ success: true, message: 'Image deleted' })
  },

  // ─── Options ──────────────────────────────────────────────────────────────

  async createProductOption(c: C) {
    const productId = parseInt(c.req.param('productId'))
    const body = c.req.valid('json' as never) as any
    const option = await ProductService.createProductOption(productId, body)
    return c.json({ success: true, data: { option } }, 201)
  },

  async updateProductOption(c: C) {
    const id = parseInt(c.req.param('id'))
    const body = c.req.valid('json' as never) as any
    const option = await ProductService.updateProductOption(id, body)
    return c.json({ success: true, data: { option } })
  },

  async deleteProductOption(c: C) {
    const id = parseInt(c.req.param('id'))
    await ProductService.deleteProductOption(id)
    return c.json({ success: true, message: 'Option deleted' })
  },

  // ─── Tags ─────────────────────────────────────────────────────────────────

  async addProductTag(c: C) {
    const productId = parseInt(c.req.param('productId'))
    const body = c.req.valid('json' as never) as any
    const tag = await ProductService.addProductTag(productId, body.tag)
    return c.json({ success: true, data: { tag } }, 201)
  },

  async removeProductTag(c: C) {
    const productId = parseInt(c.req.param('productId'))
    const tag = c.req.param('tag')
    await ProductService.removeProductTag(productId, tag)
    return c.json({ success: true, message: 'Tag removed' })
  },
}

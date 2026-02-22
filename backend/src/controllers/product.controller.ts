import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { ProductService } from '../services/product.service'

type C = Context<AuthEnv>

export const ProductController = {
  // --- Products ---
  async listProducts(c: C) {
    const { page = '1', limit = '10', search, categoryId, brandId } = c.req.valid(
      'query' as never
    ) as any
    const result = await ProductService.listProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      brandId: brandId ? parseInt(brandId) : undefined,
    })
    return c.json({ success: true, data: result })
  },

  async getProduct(c: C) {
    const id = parseInt(c.req.param('id'))
    const product = await ProductService.getProduct(id)
    return c.json({ success: true, data: { product } })
  },

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

  // --- Variants ---
  async listVariants(c: C) {
    const productId = parseInt(c.req.param('productId'))
    const variants = await ProductService.listVariants(productId)
    return c.json({ success: true, data: { variants } })
  },

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

  // --- Images ---
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

  // --- Options ---
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

  // --- Tags ---
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

  // --- Categories ---
  async listCategories(c: C) {
    const categories = await ProductService.listCategories()
    return c.json({ success: true, data: { categories } })
  },

  async getCategoryById(c: C) {
    const id = parseInt(c.req.param('id'))
    const category = await ProductService.getCategoryById(id)
    return c.json({ success: true, data: { category } })
  },

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

  // --- Brands ---
  async listBrands(c: C) {
    const brands = await ProductService.listBrands()
    return c.json({ success: true, data: { brands } })
  },

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

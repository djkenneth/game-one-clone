import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { AdminProductController } from '../../controllers/admin/products.admin.controller'
import {
  CreateProductSchema,
  UpdateProductSchema,
  CreateVariantSchema,
  UpdateVariantSchema,
  CreateProductImageSchema,
  CreateProductOptionSchema,
  UpdateProductOptionSchema,
  AddProductTagSchema,
} from '../../schema/products'

export const adminProductsRouter = new Hono<AuthEnv>()

// ─── Products ─────────────────────────────────────────────────────────────────
adminProductsRouter.post('/', zValidator('json', CreateProductSchema), AdminProductController.createProduct)
adminProductsRouter.put('/:id', zValidator('json', UpdateProductSchema), AdminProductController.updateProduct)
adminProductsRouter.delete('/:id', AdminProductController.deleteProduct)

// ─── Variants ─────────────────────────────────────────────────────────────────
adminProductsRouter.post('/:productId/variants', zValidator('json', CreateVariantSchema), AdminProductController.createVariant)
adminProductsRouter.put('/variants/:id', zValidator('json', UpdateVariantSchema), AdminProductController.updateVariant)
adminProductsRouter.delete('/variants/:id', AdminProductController.deleteVariant)

// ─── Images ───────────────────────────────────────────────────────────────────
adminProductsRouter.post('/:productId/images', zValidator('json', CreateProductImageSchema), AdminProductController.addProductImage)
adminProductsRouter.delete('/images/:id', AdminProductController.deleteProductImage)

// ─── Options ──────────────────────────────────────────────────────────────────
adminProductsRouter.post('/:productId/options', zValidator('json', CreateProductOptionSchema), AdminProductController.createProductOption)
adminProductsRouter.put('/options/:id', zValidator('json', UpdateProductOptionSchema), AdminProductController.updateProductOption)
adminProductsRouter.delete('/options/:id', AdminProductController.deleteProductOption)

// ─── Tags ─────────────────────────────────────────────────────────────────────
adminProductsRouter.post('/:productId/tags', zValidator('json', AddProductTagSchema), AdminProductController.addProductTag)
adminProductsRouter.delete('/:productId/tags/:tag', AdminProductController.removeProductTag)

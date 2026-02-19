import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../plugins/auth'
import { ProductController } from '../controllers/product.controller'
import {
  CreateProductSchema,
  UpdateProductSchema,
  CreateVariantSchema,
  UpdateVariantSchema,
} from '../schema/products'

export const productRouter = new Hono<AuthEnv>()

// ─── Public Routes ────────────────────────────────────────────────────────────

productRouter.get(
  '/',
  zValidator(
    'query',
    z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
      categoryId: z.string().optional(),
      brandId: z.string().optional(),
    })
  ),
  ProductController.listProducts
)

productRouter.get('/:id', ProductController.getProduct)
productRouter.get('/:productId/variants', ProductController.listVariants)

// ─── Admin Product Routes ─────────────────────────────────────────────────────

productRouter.post(
  '/',
  authMiddleware,
  isAdminMiddleware,
  zValidator('json', CreateProductSchema),
  ProductController.createProduct
)

productRouter.put(
  '/:id',
  authMiddleware,
  isAdminMiddleware,
  zValidator('json', UpdateProductSchema),
  ProductController.updateProduct
)

productRouter.delete('/:id', authMiddleware, isAdminMiddleware, ProductController.deleteProduct)

// ─── Admin Variant Routes ─────────────────────────────────────────────────────

productRouter.post(
  '/:productId/variants',
  authMiddleware,
  isAdminMiddleware,
  zValidator('json', CreateVariantSchema),
  ProductController.createVariant
)

productRouter.put(
  '/variants/:id',
  authMiddleware,
  isAdminMiddleware,
  zValidator('json', UpdateVariantSchema),
  ProductController.updateVariant
)

productRouter.delete(
  '/variants/:id',
  authMiddleware,
  isAdminMiddleware,
  ProductController.deleteVariant
)

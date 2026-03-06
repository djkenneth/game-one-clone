import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { AuthEnv } from '../middleware/auth.middleware'
import { ProductController } from '../controllers/product.controller'

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
    }),
  ),
  ProductController.listProducts,
)

productRouter.get('/:id', ProductController.getProduct)
productRouter.get('/:productId/variants', ProductController.listVariants)

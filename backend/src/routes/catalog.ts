import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { AuthEnv } from '../middleware/auth.middleware'
import { ProductController } from '../controllers/product.controller'

export const catalogRouter = new Hono<AuthEnv>()

// Public read-only routes
catalogRouter.get('/categories', ProductController.listCategories)
catalogRouter.get('/categories/:id', ProductController.getCategoryById)
catalogRouter.get('/brands', ProductController.listBrands)

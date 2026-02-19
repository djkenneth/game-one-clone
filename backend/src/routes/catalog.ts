import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  CreateBrandSchema,
  UpdateBrandSchema,
} from '../schema/products'
import { ProductController } from '../controllers/product.controller'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../plugins/auth'

export const catalogRouter = new Hono<AuthEnv>()

// Categories
catalogRouter.get('/categories', ProductController.listCategories)
catalogRouter.get('/categories/:id', ProductController.getCategoryById)
catalogRouter.post('/categories', authMiddleware, isAdminMiddleware, zValidator('json', CreateCategorySchema), ProductController.createCategory)
catalogRouter.put('/categories/:id', authMiddleware, isAdminMiddleware, zValidator('json', UpdateCategorySchema), ProductController.updateCategory)

// Brands
catalogRouter.get('/brands', ProductController.listBrands)
catalogRouter.post('/brands', authMiddleware, isAdminMiddleware, zValidator('json', CreateBrandSchema), ProductController.createBrand)
catalogRouter.put('/brands/:id', authMiddleware, isAdminMiddleware, zValidator('json', UpdateBrandSchema), ProductController.updateBrand)
catalogRouter.delete('/brands/:id', authMiddleware, isAdminMiddleware, ProductController.deleteBrand)

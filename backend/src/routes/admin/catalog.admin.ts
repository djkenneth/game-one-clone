import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { AdminCatalogController } from '../../controllers/admin/catalog.admin.controller'
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  CreateBrandSchema,
  UpdateBrandSchema,
} from '../../schema/products'

export const adminCatalogRouter = new Hono<AuthEnv>()

// ─── Categories ────────────────────────────────────────────────────────────────
adminCatalogRouter.post('/categories', zValidator('json', CreateCategorySchema), AdminCatalogController.createCategory)
adminCatalogRouter.put('/categories/:id', zValidator('json', UpdateCategorySchema), AdminCatalogController.updateCategory)

// ─── Brands ───────────────────────────────────────────────────────────────────
adminCatalogRouter.post('/brands', zValidator('json', CreateBrandSchema), AdminCatalogController.createBrand)
adminCatalogRouter.put('/brands/:id', zValidator('json', UpdateBrandSchema), AdminCatalogController.updateBrand)
adminCatalogRouter.delete('/brands/:id', AdminCatalogController.deleteBrand)

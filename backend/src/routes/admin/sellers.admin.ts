import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { AdminSellerController } from '../../controllers/admin/sellers.admin.controller'

const paginationQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
})

export const adminSellersRouter = new Hono<AuthEnv>()

adminSellersRouter.get('/', zValidator('query', paginationQuery), AdminSellerController.listShops)
adminSellersRouter.get('/:id', AdminSellerController.getShop)

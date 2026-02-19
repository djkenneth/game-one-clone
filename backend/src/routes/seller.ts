import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { CreateShopSchema, UpdateShopSchema } from '../schema/seller'
import { SellerController } from '../controllers/seller.controller'
import { authMiddleware, type AuthEnv } from '../plugins/auth'

const paginationQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
})

export const sellerRouter = new Hono<AuthEnv>()

// Shops
sellerRouter.get('/shops', zValidator('query', paginationQuery), SellerController.listShops)
sellerRouter.get('/shops/:id', SellerController.getShop)
sellerRouter.post('/shops', authMiddleware, zValidator('json', CreateShopSchema), SellerController.createShop)
sellerRouter.put('/shops/:id', authMiddleware, zValidator('json', UpdateShopSchema), SellerController.updateShop)

// Seller account
sellerRouter.get('/account', authMiddleware, SellerController.getSellerAccount)
sellerRouter.post(
  '/account',
  authMiddleware,
  zValidator('json', z.object({ shopId: z.number().int().positive() })),
  SellerController.createSellerAccount
)

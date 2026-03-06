import { Hono } from 'hono'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../../middleware/admin.middleware'
import { adminUsersRouter } from './users.admin'
import { adminProductsRouter } from './products.admin'
import { adminCatalogRouter } from './catalog.admin'
import { adminOrdersRouter } from './orders.admin'
import { adminPaymentsRouter } from './payments.admin'
import { adminReviewsRouter } from './reviews.admin'
import { adminSellersRouter } from './sellers.admin'

/**
 * Admin router — all routes require ADMIN role.
 * Mounted at /api/admin in src/index.ts
 */
export const adminRouter = new Hono<AuthEnv>()

// Apply auth + admin check to every admin route
adminRouter.use('*', authMiddleware, isAdminMiddleware)

adminRouter.route('/users', adminUsersRouter)
adminRouter.route('/products', adminProductsRouter)
adminRouter.route('/catalog', adminCatalogRouter)
adminRouter.route('/orders', adminOrdersRouter)
adminRouter.route('/payments', adminPaymentsRouter)
adminRouter.route('/reviews', adminReviewsRouter)
adminRouter.route('/sellers', adminSellersRouter)

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { AdminReviewController } from '../../controllers/admin/reviews.admin.controller'

const paginationQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
})

export const adminReviewsRouter = new Hono<AuthEnv>()

adminReviewsRouter.get(
  '/product/:productId',
  zValidator('query', paginationQuery),
  AdminReviewController.getProductReviews,
)

adminReviewsRouter.delete('/:id', AdminReviewController.deleteReview)

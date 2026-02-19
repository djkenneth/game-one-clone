import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { CreateReviewSchema } from '../schema/review'
import { ReviewController } from '../controllers/review.controller'
import { authMiddleware, type AuthEnv } from '../plugins/auth'

const paginationQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
})

export const reviewRouter = new Hono<AuthEnv>()

reviewRouter.get('/product/:productId', zValidator('query', paginationQuery), ReviewController.getProductReviews)
reviewRouter.post('/', authMiddleware, zValidator('json', CreateReviewSchema), ReviewController.createReview)
reviewRouter.get('/mine', authMiddleware, zValidator('query', paginationQuery), ReviewController.getUserReviews)
reviewRouter.delete('/:id', authMiddleware, ReviewController.deleteReview)

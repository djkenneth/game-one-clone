import type { Context } from 'hono'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { ReviewService } from '../../services/review.service'

type C = Context<AuthEnv>

export const AdminReviewController = {
  async getProductReviews(c: C) {
    const productId = parseInt(c.req.param('productId'))
    const { page = '1', limit = '20' } = c.req.valid('query' as never) as {
      page?: string
      limit?: string
    }
    const result = await ReviewService.getProductReviews(
      productId,
      parseInt(page),
      parseInt(limit),
    )
    return c.json({ success: true, data: result })
  },

  async deleteReview(c: C) {
    const id = parseInt(c.req.param('id'))
    await ReviewService.adminDeleteReview(id)
    return c.json({ success: true, message: 'Review deleted' })
  },
}

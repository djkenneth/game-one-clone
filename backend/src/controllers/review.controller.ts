import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { ReviewService } from '../services/review.service'

type C = Context<AuthEnv>

export const ReviewController = {
  async createReview(c: C) {
    const user = c.get('user')
    const body = c.req.valid('json' as never) as any
    const review = await ReviewService.createReview({ ...body, userId: user.id })
    return c.json({ success: true, data: { review } }, 201)
  },

  async getProductReviews(c: C) {
    const productId = parseInt(c.req.param('productId'))
    const { page = '1', limit = '10' } = c.req.valid('query' as never) as any
    const result = await ReviewService.getProductReviews(
      productId,
      parseInt(page),
      parseInt(limit)
    )
    return c.json({ success: true, data: result })
  },

  async getUserReviews(c: C) {
    const user = c.get('user')
    const { page = '1', limit = '10' } = c.req.valid('query' as never) as any
    const result = await ReviewService.getUserReviews(user.id, parseInt(page), parseInt(limit))
    return c.json({ success: true, data: result })
  },

  async deleteReview(c: C) {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    await ReviewService.deleteReview(id, user.id)
    return c.json({ success: true, message: 'Review deleted' })
  },
}

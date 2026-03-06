import { prisma } from '../index'
import { BadRequestError, NotFoundError } from '../utils/errors'

type CreateReviewData = {
  productId: number
  orderItemId: number
  userId: number
  rating: number
  comment?: string
}

export const ReviewService = {
  async createReview(data: CreateReviewData) {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: data.orderItemId },
      include: { order: true },
    })
    if (!orderItem) throw new NotFoundError('Order item not found')
    if (orderItem.order.userId !== data.userId) {
      throw new BadRequestError('You can only review items from your own orders')
    }

    const existing = await prisma.review.findUnique({ where: { orderItemId: data.orderItemId } })
    if (existing) throw new BadRequestError('You have already reviewed this item')

    return prisma.review.create({ data })
  },

  async getProductReviews(productId: number, page: number, limit: number) {
    const skip = (page - 1) * limit
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: { select: { id: true, email: true, profile: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { productId } }),
    ])
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0
    return { reviews, total, page, pageSize: limit, avgRating }
  },

  async getUserReviews(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        include: { product: { select: { id: true, name: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { userId } }),
    ])
    return { reviews, total, page, pageSize: limit }
  },

  async deleteReview(id: number, userId: number) {
    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) throw new NotFoundError('Review not found')
    if (review.userId !== userId) throw new BadRequestError('You can only delete your own reviews')
    await prisma.review.delete({ where: { id } })
  },

  async adminDeleteReview(id: number) {
    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) throw new NotFoundError('Review not found')
    await prisma.review.delete({ where: { id } })
  },
}

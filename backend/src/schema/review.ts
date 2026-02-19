import { z } from 'zod'

export const CreateReviewSchema = z.object({
  productId: z.number().int().positive(),
  orderItemId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
})

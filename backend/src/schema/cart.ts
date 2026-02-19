import { z } from 'zod'

export const AddCartItemSchema = z.object({
  productVariantId: z.number().int().positive(),
  quantity: z.number().int().min(1),
  price: z.number().positive(),
})

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
})

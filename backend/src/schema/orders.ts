import { z } from 'zod'

export const OrderStatusSchema = z.enum([
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
])

export const CreateOrderSchema = z.object({
  shopId: z.number().int().positive(),
  addressId: z.number().int().positive(),
  items: z
    .array(
      z.object({
        productVariantId: z.number().int().positive(),
        quantity: z.number().int().min(1),
        price: z.number().positive(),
      })
    )
    .min(1),
})

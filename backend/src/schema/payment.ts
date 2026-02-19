import { z } from 'zod'

export const PaymentStatusSchema = z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])

export const CreatePaymentSchema = z.object({
  orderId: z.number().int().positive(),
  method: z.string().min(1),
  amount: z.number().positive(),
})

export const CreateRefundSchema = z.object({
  paymentId: z.number().int().positive(),
  orderId: z.number().int().positive(),
  amount: z.number().positive(),
})

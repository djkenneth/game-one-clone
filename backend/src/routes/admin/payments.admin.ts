import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { AdminPaymentController } from '../../controllers/admin/payments.admin.controller'
import { CreateRefundSchema, PaymentStatusSchema } from '../../schema/payment'

export const adminPaymentsRouter = new Hono<AuthEnv>()

adminPaymentsRouter.put(
  '/:id/status',
  zValidator('json', z.object({ status: PaymentStatusSchema })),
  AdminPaymentController.updatePaymentStatus,
)

adminPaymentsRouter.post(
  '/refund',
  zValidator('json', CreateRefundSchema),
  AdminPaymentController.createRefund,
)

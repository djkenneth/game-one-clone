import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { CreatePaymentSchema, CreateRefundSchema, PaymentStatusSchema } from '../schema/payment'
import { PaymentController } from '../controllers/payment.controller'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../plugins/auth'
import { z } from 'zod'

export const paymentRouter = new Hono<AuthEnv>()

paymentRouter.use('*', authMiddleware)

paymentRouter.post('/', zValidator('json', CreatePaymentSchema), PaymentController.createPayment)
paymentRouter.get('/order/:orderId', PaymentController.getPayment)
paymentRouter.put(
  '/:id/status',
  isAdminMiddleware,
  zValidator('json', z.object({ status: PaymentStatusSchema })),
  PaymentController.updatePaymentStatus
)
paymentRouter.post(
  '/refund',
  isAdminMiddleware,
  zValidator('json', CreateRefundSchema),
  PaymentController.createRefund
)

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { CreatePaymentSchema } from '../schema/payment'
import { PaymentController } from '../controllers/payment.controller'
import { authMiddleware, type AuthEnv } from '../middleware/auth.middleware'

export const paymentRouter = new Hono<AuthEnv>()

paymentRouter.use('*', authMiddleware)

paymentRouter.post('/', zValidator('json', CreatePaymentSchema), PaymentController.createPayment)
paymentRouter.get('/order/:orderId', PaymentController.getPayment)

import type { Context } from 'hono'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { PaymentService } from '../../services/payment.service'
import type { PaymentStatus } from '@prisma/client'

type C = Context<AuthEnv>

export const AdminPaymentController = {
  async updatePaymentStatus(c: C) {
    const id = parseInt(c.req.param('id'))
    const { status } = c.req.valid('json' as never) as { status: PaymentStatus }
    const payment = await PaymentService.updatePaymentStatus(id, status)
    return c.json({ success: true, data: { payment } })
  },

  async createRefund(c: C) {
    const body = c.req.valid('json' as never) as any
    const refund = await PaymentService.createRefund(body.paymentId, body.orderId, body.amount)
    return c.json({ success: true, data: { refund } }, 201)
  },
}

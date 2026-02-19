import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { PaymentService } from '../services/payment.service'
import type { PaymentStatus } from '@prisma/client'

type C = Context<AuthEnv>

export const PaymentController = {
  async createPayment(c: C) {
    const user = c.get('user')
    const body = c.req.valid('json' as never) as any
    const payment = await PaymentService.createPayment({ ...body, userId: user.id })
    return c.json({ success: true, data: { payment } }, 201)
  },

  async getPayment(c: C) {
    const orderId = parseInt(c.req.param('orderId'))
    const payment = await PaymentService.getPayment(orderId)
    return c.json({ success: true, data: { payment } })
  },

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

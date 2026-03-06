import type { Context } from 'hono'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { OrderService } from '../../services/order.service'
import type { OrderStatus } from '@prisma/client'

type C = Context<AuthEnv>

export const AdminOrderController = {
  async listOrders(c: C) {
    const { status, page = '1', limit = '20' } = c.req.valid('query' as never) as {
      status?: string
      page?: string
      limit?: string
    }
    const result = await OrderService.listOrders(
      status as OrderStatus | undefined,
      parseInt(page),
      parseInt(limit),
    )
    return c.json({ success: true, data: result })
  },

  async getOrder(c: C) {
    const id = parseInt(c.req.param('id'))
    const order = await OrderService.getOrder(id)
    return c.json({ success: true, data: { order } })
  },

  async updateOrderStatus(c: C) {
    const id = parseInt(c.req.param('id'))
    const { status } = c.req.valid('json' as never) as { status: OrderStatus }
    const order = await OrderService.updateOrderStatus(id, status)
    return c.json({ success: true, data: { order } })
  },
}

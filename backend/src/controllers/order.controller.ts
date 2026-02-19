import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { OrderService } from '../services/order.service'
import type { OrderStatus } from '@prisma/client'

type C = Context<AuthEnv>

export const OrderController = {
  // --- User ---
  async createOrder(c: C) {
    const user = c.get('user')
    const body = c.req.valid('json' as never) as any
    const order = await OrderService.createOrder(user.id, body)
    return c.json({ success: true, data: { order } }, 201)
  },

  async getUserOrders(c: C) {
    const user = c.get('user')
    const { page = '1', limit = '10' } = c.req.valid('query' as never) as any
    const result = await OrderService.getUserOrders(user.id, parseInt(page), parseInt(limit))
    return c.json({ success: true, data: result })
  },

  async getUserOrder(c: C) {
    const user = c.get('user')
    const orderId = parseInt(c.req.param('id'))
    const order = await OrderService.getUserOrder(user.id, orderId)
    return c.json({ success: true, data: { order } })
  },

  async cancelOrder(c: C) {
    const user = c.get('user')
    const orderId = parseInt(c.req.param('id'))
    const order = await OrderService.cancelOrder(user.id, orderId)
    return c.json({ success: true, data: { order } })
  },

  // --- Admin ---
  async listOrders(c: C) {
    const { status, page = '1', limit = '10' } = c.req.valid('query' as never) as any
    const result = await OrderService.listOrders(
      status as OrderStatus | undefined,
      parseInt(page),
      parseInt(limit)
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

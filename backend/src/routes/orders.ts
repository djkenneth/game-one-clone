import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authMiddleware, type AuthEnv } from '../middleware/auth.middleware'
import { OrderController } from '../controllers/order.controller'
import { CreateOrderSchema } from '../schema/orders'

export const orderRouter = new Hono<AuthEnv>()

// ─── User Order Routes ────────────────────────────────────────────────────────

const userOrderRouter = new Hono<AuthEnv>()
userOrderRouter.use('*', authMiddleware)

userOrderRouter.post('/', zValidator('json', CreateOrderSchema), OrderController.createOrder)
userOrderRouter.get(
  '/',
  zValidator('query', z.object({ page: z.string().optional(), limit: z.string().optional() })),
  OrderController.getUserOrders,
)
userOrderRouter.get('/:id', OrderController.getUserOrder)
userOrderRouter.put('/:id/cancel', OrderController.cancelOrder)

orderRouter.route('/', userOrderRouter)

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../plugins/auth'
import { OrderController } from '../controllers/order.controller'
import { CreateOrderSchema, OrderStatusSchema } from '../schema/orders'

export const orderRouter = new Hono<AuthEnv>()

// ─── User Order Routes ────────────────────────────────────────────────────────

const userOrderRouter = new Hono<AuthEnv>()
userOrderRouter.use('*', authMiddleware)

userOrderRouter.post('/', zValidator('json', CreateOrderSchema), OrderController.createOrder)
userOrderRouter.get(
  '/',
  zValidator('query', z.object({ page: z.string().optional(), limit: z.string().optional() })),
  OrderController.getUserOrders
)
userOrderRouter.get('/:id', OrderController.getUserOrder)
userOrderRouter.put('/:id/cancel', OrderController.cancelOrder)

orderRouter.route('/', userOrderRouter)

// ─── Admin Routes ─────────────────────────────────────────────────────────────

const adminRouter = new Hono<AuthEnv>()
adminRouter.use('*', authMiddleware, isAdminMiddleware)

adminRouter.get(
  '/orders',
  zValidator(
    'query',
    z.object({
      status: OrderStatusSchema.optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
    })
  ),
  OrderController.listOrders
)

adminRouter.get('/:id', OrderController.getOrder)

adminRouter.put(
  '/:id/status',
  zValidator('json', z.object({ status: OrderStatusSchema })),
  OrderController.updateOrderStatus
)

orderRouter.route('/admin', adminRouter)

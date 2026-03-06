import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { AuthEnv } from '../../middleware/auth.middleware'
import { AdminOrderController } from '../../controllers/admin/orders.admin.controller'
import { OrderStatusSchema } from '../../schema/orders'

export const adminOrdersRouter = new Hono<AuthEnv>()

adminOrdersRouter.get(
  '/',
  zValidator(
    'query',
    z.object({
      status: OrderStatusSchema.optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
  ),
  AdminOrderController.listOrders,
)

adminOrdersRouter.get('/:id', AdminOrderController.getOrder)

adminOrdersRouter.put(
  '/:id/status',
  zValidator('json', z.object({ status: OrderStatusSchema })),
  AdminOrderController.updateOrderStatus,
)

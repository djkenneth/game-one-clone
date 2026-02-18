import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../index'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../plugins/auth'
import { BadRequestError, NotFoundError } from '../utils/errors'

const orderStatusSchema = z.enum([
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
])

export const orderRouter = new Hono<AuthEnv>()

// ─── Admin Routes ─────────────────────────────────────────────────────────────

const adminRouter = new Hono<AuthEnv>()
adminRouter.use('*', authMiddleware, isAdminMiddleware)

// List all orders
adminRouter.get(
  '/orders',
  zValidator(
    'query',
    z.object({
      status: orderStatusSchema.optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
    })
  ),
  async (c) => {
    const { status, page = '1', limit = '10' } = c.req.valid('query')
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const where = status ? { status } : {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, email: true } },
          items: true,
          payment: true,
          shipment: true,
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    return c.json({
      success: true,
      data: { orders, total, page: parseInt(page), pageSize: parseInt(limit) },
    })
  }
)

// Update order status
adminRouter.put(
  '/:id/status',
  zValidator('json', z.object({ status: orderStatusSchema })),
  async (c) => {
    const id = parseInt(c.req.param('id'))
    const { status } = c.req.valid('json')

    const order = await prisma.order.findUnique({ where: { id } })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestError('Cannot update cancelled order')
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true, payment: true, shipment: true },
    })

    return c.json({ success: true, data: { order: updatedOrder } })
  }
)

// Get orders for a specific user
adminRouter.get(
  '/users/:userId/orders',
  zValidator(
    'query',
    z.object({ page: z.string().optional(), limit: z.string().optional() })
  ),
  async (c) => {
    const userId = parseInt(c.req.param('userId'))
    const { page = '1', limit = '10' } = c.req.valid('query')
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: { items: true, payment: true, shipment: true },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId } }),
    ])

    return c.json({
      success: true,
      data: { orders, total, page: parseInt(page), pageSize: parseInt(limit) },
    })
  }
)

orderRouter.route('/admin', adminRouter)

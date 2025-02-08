import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { auth, isAdmin } from '../plugins/auth'
import { BadRequestError, NotFoundError } from '../utils/errors'

// Response Types
const OrderStatusType = t.Enum({
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
})


export const orderRouter = new Elysia({ prefix: '/orders' })
  .use(auth)

 // Admin Routes
  .group('/admin', app => app
  .onBeforeHandle([isAdmin])
  
  .get('/orders',
    async ({ query }) => {
      const { status, page = '1', limit = '10' } = query
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const where = status ? { status: status as string } : {}

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            products: {
              include: { product: true }
            },
            events: true
          },
          skip,
          take: parseInt(limit as string),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.order.count({ where })
      ])

      return {
        success: true,
        data: {
          orders,
          total,
          page: parseInt(page as string),
          pageSize: parseInt(limit as string)
        }
      }
    },
    {
      query: t.Object({
        status: t.Optional(OrderStatusType),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String())
      }),
      detail: {
        tags: ['Orders (Admin)'],
        summary: 'List all orders',
        description: 'Admin endpoint to list all orders with optional status filter',
        security: [{ bearerAuth: [] }]
      }
    }
  )

  .put('/:id/status',
    async ({ params: { id }, body }) => {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) }
      })

      if (!order) {
        throw new NotFoundError('Order not found')
      }

      if (order.status === 'CANCELLED') {
        throw new BadRequestError('Cannot update cancelled order')
      }

      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(id) },
        data: {
          status: body.status,
          events: {
            create: {
              status: body.status
            }
          }
        },
        include: {
          products: {
            include: { product: true }
          },
          events: true
        }
      })

      return {
        success: true,
        data: { order: updatedOrder }
      }
    },
    {
      body: t.Object({
        status: OrderStatusType
      }),
      detail: {
        tags: ['Orders (Admin)'],
        summary: 'Update order status',
        description: 'Admin endpoint to update order status',
        security: [{ bearerAuth: [] }]
      }
    }
  )

  .get('/users/:userId/orders',
    async ({ params: { userId }, query }) => {
      const { page = '1', limit = '10' } = query
      const skip = (parseInt(page) - 1) * parseInt(limit)

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where: { userId: parseInt(userId) },
          include: {
            products: {
              include: { product: true }
            },
            events: true
          },
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.order.count({
          where: { userId: parseInt(userId) }
        })
      ])

      return {
        success: true,
        data: {
          orders,
          total,
          page: parseInt(page),
          pageSize: parseInt(limit)
        }
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String())
      }),
      detail: {
        tags: ['Orders (Admin)'],
        summary: 'List user orders',
        description: 'Admin endpoint to list all orders for a specific user',
        security: [{ bearerAuth: [] }]
      }
    }
  )
)
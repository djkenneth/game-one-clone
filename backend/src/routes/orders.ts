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

const OrderProductType = t.Object({
  id: t.Number(),
  quantity: t.Number(),
  product: t.Object({
    id: t.Number(),
    title: t.String(),
    price: t.Number(),
    image: t.String()
  })
})

const OrderEventType = t.Object({
  id: t.Number(),
  status: OrderStatusType,
  createdAt: t.String()
})

const OrderType = t.Object({
  id: t.Number(),
  netAmount: t.Number(),
  status: OrderStatusType,
  address: t.String(),
  products: t.Array(OrderProductType),
  events: t.Array(OrderEventType),
  createdAt: t.String(),
  updatedAt: t.String()
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
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Orders retrieved successfully',
            content: {
              'application/json': {
                schema: t.Object({
                  success: t.Boolean(),
                  data: t.Object({
                    orders: t.Array(t.Intersect([
                      OrderType,
                      t.Object({
                        user: t.Object({
                          id: t.Number(),
                          name: t.String(),
                          email: t.String()
                        })
                      })
                    ])),
                    total: t.Number(),
                    page: t.Number(),
                    pageSize: t.Number()
                  })
                })
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin only'
          }
        }
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
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Order status updated successfully',
            content: {
              'application/json': {
                schema: t.Object({
                  success: t.Boolean(),
                  data: t.Object({
                    order: OrderType
                  })
                })
              }
            }
          },
          400: {
            description: 'Invalid status update'
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin only'
          },
          404: {
            description: 'Order not found'
          }
        }
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
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Orders retrieved successfully',
            content: {
              'application/json': {
                schema: t.Object({
                  success: t.Boolean(),
                  data: t.Object({
                    orders: t.Array(OrderType),
                    total: t.Number(),
                    page: t.Number(),
                    pageSize: t.Number()
                  })
                })
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin only'
          }
        }
      }
    }
  )
)
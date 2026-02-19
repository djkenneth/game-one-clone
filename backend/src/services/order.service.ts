import { prisma } from '../index'
import { BadRequestError, NotFoundError } from '../utils/errors'
import type { OrderStatus } from '@prisma/client'

type OrderItemInput = {
  productVariantId: number
  quantity: number
  price: number
}

type CreateOrderData = {
  shopId: number
  addressId: number
  items: OrderItemInput[]
}

export const OrderService = {
  async createOrder(userId: number, data: CreateOrderData) {
    for (const item of data.items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
      })
      if (!variant) throw new NotFoundError(`Variant ${item.productVariantId} not found`)
      if (variant.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for variant ${item.productVariantId}`)
      }
    }

    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const order = await prisma.order.create({
      data: {
        userId,
        shopId: data.shopId,
        addressId: data.addressId,
        totalAmount,
        items: {
          create: data.items.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true, address: true },
    })

    for (const item of data.items) {
      await prisma.productVariant.update({
        where: { id: item.productVariantId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return order
  },

  async getUserOrders(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: { include: { variant: true } },
          payment: true,
          shipment: true,
          shop: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId } }),
    ])
    return { orders, total, page, pageSize: limit }
  },

  async getUserOrder(userId: number, orderId: number) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { include: { variant: true } },
        payment: true,
        shipment: { include: { events: true } },
        address: true,
        shop: { select: { id: true, name: true } },
      },
    })
    if (!order) throw new NotFoundError('Order not found')
    return order
  },

  async cancelOrder(userId: number, orderId: number) {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId } })
    if (!order) throw new NotFoundError('Order not found')
    if (!['PENDING', 'PAID'].includes(order.status)) {
      throw new BadRequestError('Order cannot be cancelled at this stage')
    }
    return prisma.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } })
  },

  // --- Admin ---
  async listOrders(status: OrderStatus | undefined, page: number, limit: number) {
    const skip = (page - 1) * limit
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
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])
    return { orders, total, page, pageSize: limit }
  },

  async getOrder(id: number) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true } },
        items: { include: { variant: true } },
        payment: true,
        shipment: { include: { events: true } },
        address: true,
      },
    })
    if (!order) throw new NotFoundError('Order not found')
    return order
  },

  async updateOrderStatus(id: number, status: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundError('Order not found')
    if (order.status === 'CANCELLED') throw new BadRequestError('Cannot update cancelled order')
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true, payment: true, shipment: true },
    })
  },
}

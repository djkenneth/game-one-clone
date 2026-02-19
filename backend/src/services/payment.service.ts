import { prisma } from '../index'
import { BadRequestError, NotFoundError } from '../utils/errors'
import type { PaymentStatus } from '@prisma/client'

type CreatePaymentData = {
  orderId: number
  userId: number
  method: string
  amount: number
}

export const PaymentService = {
  async createPayment(data: CreatePaymentData) {
    const order = await prisma.order.findUnique({ where: { id: data.orderId } })
    if (!order) throw new NotFoundError('Order not found')
    if (order.userId !== data.userId) throw new BadRequestError('Order does not belong to user')

    const existing = await prisma.payment.findUnique({ where: { orderId: data.orderId } })
    if (existing) throw new BadRequestError('Payment already exists for this order')

    const payment = await prisma.payment.create({
      data: {
        orderId: data.orderId,
        userId: data.userId,
        method: data.method,
        amount: data.amount,
        status: 'PENDING',
      },
    })

    await prisma.order.update({
      where: { id: data.orderId },
      data: { paymentStatus: 'PENDING' },
    })

    return payment
  },

  async getPayment(orderId: number) {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { refunds: true },
    })
    if (!payment) throw new NotFoundError('Payment not found')
    return payment
  },

  async updatePaymentStatus(id: number, status: PaymentStatus) {
    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) throw new NotFoundError('Payment not found')

    const updated = await prisma.payment.update({
      where: { id },
      data: {
        status,
        paidAt: status === 'PAID' ? new Date() : undefined,
      },
    })

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: status },
    })

    return updated
  },

  async createRefund(paymentId: number, orderId: number, amount: number) {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
    if (!payment) throw new NotFoundError('Payment not found')
    if (payment.status !== 'PAID') throw new BadRequestError('Payment is not in PAID status')

    return prisma.refund.create({
      data: { paymentId, orderId, amount, status: 'PENDING' },
    })
  },
}

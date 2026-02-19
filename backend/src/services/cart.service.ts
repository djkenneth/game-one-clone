import { prisma } from '../index'
import { BadRequestError, NotFoundError } from '../utils/errors'

export const CartService = {
  async getCart(userId: number) {
    return prisma.cart.findFirst({
      where: { userId, isActive: true },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { select: { id: true, name: true } } },
            },
          },
        },
      },
    })
  },

  async addItem(userId: number, productVariantId: number, quantity: number, price: number) {
    const variant = await prisma.productVariant.findUnique({ where: { id: productVariantId } })
    if (!variant) throw new NotFoundError('Product variant not found')
    if (!variant.isActive) throw new BadRequestError('Product variant is not available')
    if (variant.stock < quantity) throw new BadRequestError('Insufficient stock')

    let cart = await prisma.cart.findFirst({ where: { userId, isActive: true } })
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } })
    }

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productVariantId },
    })

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { variant: true },
      })
    }

    return prisma.cartItem.create({
      data: { cartId: cart.id, productVariantId, quantity, price },
      include: { variant: true },
    })
  },

  async updateItem(userId: number, itemId: number, quantity: number) {
    const cart = await prisma.cart.findFirst({ where: { userId, isActive: true } })
    if (!cart) throw new NotFoundError('Cart not found')

    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } })
    if (!item) throw new NotFoundError('Cart item not found')

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { variant: true },
    })
  },

  async removeItem(userId: number, itemId: number) {
    const cart = await prisma.cart.findFirst({ where: { userId, isActive: true } })
    if (!cart) throw new NotFoundError('Cart not found')

    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } })
    if (!item) throw new NotFoundError('Cart item not found')

    await prisma.cartItem.delete({ where: { id: itemId } })
  },

  async clearCart(userId: number) {
    const cart = await prisma.cart.findFirst({ where: { userId, isActive: true } })
    if (!cart) return
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  },
}

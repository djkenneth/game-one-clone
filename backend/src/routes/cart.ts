import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../index'
import { authMiddleware, type AuthEnv } from '../plugins/auth'
import { BadRequestError, NotFoundError } from '../utils/errors'

export const cartRouter = new Hono<AuthEnv>()

cartRouter.use('*', authMiddleware)

// Get cart
cartRouter.get('/', async (c) => {
  const user = c.get('user')

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id, isActive: true },
    include: {
      items: {
        include: { variant: true },
      },
    },
  })

  return c.json({ success: true, data: { cart } })
})

// Add item to cart
cartRouter.post(
  '/',
  zValidator(
    'json',
    z.object({
      productVariantId: z.number(),
      quantity: z.number().min(1),
      price: z.number(),
    })
  ),
  async (c) => {
    const user = c.get('user')
    const { productVariantId, quantity, price } = c.req.valid('json')

    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    })

    if (!variant) {
      throw new NotFoundError('Product variant not found')
    }

    if (!variant.isActive) {
      throw new BadRequestError('Product variant is not available')
    }

    let cart = await prisma.cart.findFirst({
      where: { userId: user.id, isActive: true },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      })
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productVariantId },
    })

    let cartItem

    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { variant: true },
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productVariantId, quantity, price },
        include: { variant: true },
      })
    }

    return c.json({ success: true, data: { cartItem } })
  }
)

// Update cart item quantity
cartRouter.put(
  '/:id',
  zValidator('json', z.object({ quantity: z.number().min(1) })),
  async (c) => {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    const { quantity } = c.req.valid('json')

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id, isActive: true },
    })

    if (!cart) {
      throw new NotFoundError('Cart not found')
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id, cartId: cart.id },
    })

    if (!cartItem) {
      throw new NotFoundError('Cart item not found')
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { variant: true },
    })

    return c.json({ success: true, data: { cartItem: updatedItem } })
  }
)

// Remove item from cart
cartRouter.delete('/:id', async (c) => {
  const user = c.get('user')
  const id = parseInt(c.req.param('id'))

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id, isActive: true },
  })

  if (!cart) {
    throw new NotFoundError('Cart not found')
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { id, cartId: cart.id },
  })

  if (!cartItem) {
    throw new NotFoundError('Cart item not found')
  }

  await prisma.cartItem.delete({ where: { id } })

  return c.json({ success: true, message: 'Item removed from cart' })
})

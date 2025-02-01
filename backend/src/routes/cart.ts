import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { auth } from '../plugins/auth'
import { NotFoundError } from '../utils/errors'

// Response Types
const CartItemType = t.Object({
  id: t.Number(),
  quantity: t.Number(),
  product: t.Object({
    id: t.Number(),
    title: t.String(),
    price: t.Number(),
    image: t.String(),
    availability: t.Boolean()
  })
})

const CartResponseType = t.Object({
  success: t.Boolean(),
  data: t.Object({
    items: t.Array(CartItemType),
    total: t.Number()
  })
})

export const cartRouter = new Elysia({ prefix: '/cart' })
  .use(auth)
  
  .get('/',
    async ({ user }) => {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { product: true }
      })

      const total = cartItems.reduce(
        (sum, item) => sum + (item.quantity * item.product.price),
        0
      )

      return {
        success: true,
        data: {
          items: cartItems,
          total
        }
      }
    },
    {
      detail: {
        tags: ['Cart'],
        summary: 'Get cart',
        description: 'Retrieve current user\'s shopping cart',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Cart retrieved successfully',
            content: {
              'application/json': {
                schema: CartResponseType
              }
            }
          },
          401: {
            description: 'Unauthorized'
          }
        }
      }
    }
  )

  .post('/',
    async ({ body, user }) => {
      const { productId, quantity } = body

      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        throw new NotFoundError('Product not found')
      }

      if (!product.availability) {
        throw new BadRequestError('Product is not available')
      }

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userId: user.id,
          productId
        }
      })

      let cartItem

      if (existingItem) {
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity
          },
          include: { product: true }
        })
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            userId: user.id,
            productId,
            quantity
          },
          include: { product: true }
        })
      }

      return {
        success: true,
        data: { cartItem }
      }
    },
    {
      body: t.Object({
        productId: t.Number(),
        quantity: t.Number({ minimum: 1 })
      }),
      detail: {
        tags: ['Cart'],
        summary: 'Add to cart',
        description: 'Add a product to shopping cart',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Product added to cart successfully',
            content: {
              'application/json': {
                schema: t.Object({
                  success: t.Boolean(),
                  data: t.Object({
                    cartItem: CartItemType
                  })
                })
              }
            }
          },
          400: {
            description: 'Product not available'
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Product not found'
          }
        }
      }
    }
  )

  .put('/:id',
    async ({ params: { id }, body, user }) => {
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: parseInt(id),
          userId: user.id
        }
      })

      if (!cartItem) {
        throw new NotFoundError('Cart item not found')
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: parseInt(id) },
        data: { quantity: body.quantity },
        include: { product: true }
      })

      return {
        success: true,
        data: { cartItem: updatedItem }
      }
    },
    {
      body: t.Object({
        quantity: t.Number({ minimum: 1 })
      }),
      detail: {
        tags: ['Cart'],
        summary: 'Update cart item',
        description: 'Update quantity of a cart item',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Cart item updated successfully',
            content: {
              'application/json': {
                schema: t.Object({
                  success: t.Boolean(),
                  data: t.Object({
                    cartItem: CartItemType
                  })
                })
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Cart item not found'
          }
        }
      }
    }
  )

  .delete('/:id',
    async ({ params: { id }, user }) => {
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: parseInt(id),
          userId: user.id
        }
      })

      if (!cartItem) {
        throw new NotFoundError('Cart item not found')
      }

      await prisma.cartItem.delete({
        where: { id: parseInt(id) }
      })

      return {
        success: true,
        message: 'Item removed from cart'
      }
    },
    {
      detail: {
        tags: ['Cart'],
        summary: 'Remove from cart',
        description: 'Remove an item from shopping cart',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Item removed successfully',
            content: {
              'application/json': {
                schema: t.Object({
                  success: t.Boolean(),
                  message: t.String()
                })
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          404: {
            description: 'Cart item not found'
          }
        }
      }
    }
  )
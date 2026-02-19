import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { CartService } from '../services/cart.service'

type C = Context<AuthEnv>

export const CartController = {
  async getCart(c: C) {
    const user = c.get('user')
    const cart = await CartService.getCart(user.id)
    return c.json({ success: true, data: { cart } })
  },

  async addItem(c: C) {
    const user = c.get('user')
    const { productVariantId, quantity, price } = c.req.valid('json' as never) as any
    const cartItem = await CartService.addItem(user.id, productVariantId, quantity, price)
    return c.json({ success: true, data: { cartItem } }, 201)
  },

  async updateItem(c: C) {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    const { quantity } = c.req.valid('json' as never) as any
    const cartItem = await CartService.updateItem(user.id, id, quantity)
    return c.json({ success: true, data: { cartItem } })
  },

  async removeItem(c: C) {
    const user = c.get('user')
    const id = parseInt(c.req.param('id'))
    await CartService.removeItem(user.id, id)
    return c.json({ success: true, message: 'Item removed from cart' })
  },

  async clearCart(c: C) {
    const user = c.get('user')
    await CartService.clearCart(user.id)
    return c.json({ success: true, message: 'Cart cleared' })
  },
}

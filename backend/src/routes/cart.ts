import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthEnv } from '../plugins/auth'
import { CartController } from '../controllers/cart.controller'
import { AddCartItemSchema, UpdateCartItemSchema } from '../schema/cart'

export const cartRouter = new Hono<AuthEnv>()

cartRouter.use('*', authMiddleware)

cartRouter.get('/', CartController.getCart)
cartRouter.post('/', zValidator('json', AddCartItemSchema), CartController.addItem)
cartRouter.put('/:id', zValidator('json', UpdateCartItemSchema), CartController.updateItem)
cartRouter.delete('/clear', CartController.clearCart)
cartRouter.delete('/:id', CartController.removeItem)

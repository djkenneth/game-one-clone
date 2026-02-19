import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { WalletService } from '../services/wallet.service'

type C = Context<AuthEnv>

export const WalletController = {
  async getWallet(c: C) {
    const user = c.get('user')
    const wallet = await WalletService.getWallet(user.id)
    return c.json({ success: true, data: { wallet } })
  },

  async getTransactions(c: C) {
    const user = c.get('user')
    const { page = '1', limit = '10' } = c.req.valid('query' as never) as any
    const result = await WalletService.getTransactions(user.id, parseInt(page), parseInt(limit))
    return c.json({ success: true, data: result })
  },

  async deposit(c: C) {
    const user = c.get('user')
    const { amount } = c.req.valid('json' as never) as { amount: number }
    const transaction = await WalletService.deposit(user.id, amount)
    return c.json({ success: true, data: { transaction } }, 201)
  },

  async withdraw(c: C) {
    const user = c.get('user')
    const { amount } = c.req.valid('json' as never) as { amount: number }
    const transaction = await WalletService.withdraw(user.id, amount)
    return c.json({ success: true, data: { transaction } }, 201)
  },
}

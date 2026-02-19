import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { WalletController } from '../controllers/wallet.controller'
import { authMiddleware, type AuthEnv } from '../plugins/auth'

const amountSchema = z.object({ amount: z.number().positive() })
const paginationQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
})

export const walletRouter = new Hono<AuthEnv>()

walletRouter.use('*', authMiddleware)

walletRouter.get('/', WalletController.getWallet)
walletRouter.get('/transactions', zValidator('query', paginationQuery), WalletController.getTransactions)
walletRouter.post('/deposit', zValidator('json', amountSchema), WalletController.deposit)
walletRouter.post('/withdraw', zValidator('json', amountSchema), WalletController.withdraw)

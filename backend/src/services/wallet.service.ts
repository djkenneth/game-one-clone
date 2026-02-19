import { prisma } from '../index'
import { BadRequestError } from '../utils/errors'

export const WalletService = {
  async getOrCreateWallet(userId: number) {
    let wallet = await prisma.wallet.findUnique({ where: { userId } })
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { userId } })
    }
    return wallet
  },

  async getWallet(userId: number) {
    return this.getOrCreateWallet(userId)
  },

  async getTransactions(userId: number, page: number, limit: number) {
    const wallet = await this.getOrCreateWallet(userId)
    const skip = (page - 1) * limit
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { walletId: wallet.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where: { walletId: wallet.id } }),
    ])
    return { wallet, transactions, total, page, pageSize: limit }
  },

  async deposit(userId: number, amount: number) {
    if (amount <= 0) throw new BadRequestError('Amount must be positive')
    const wallet = await this.getOrCreateWallet(userId)

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: { walletId: wallet.id, type: 'DEPOSIT', amount, status: 'COMPLETED' },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } },
      }),
    ])

    return transaction
  },

  async withdraw(userId: number, amount: number) {
    if (amount <= 0) throw new BadRequestError('Amount must be positive')
    const wallet = await this.getOrCreateWallet(userId)
    if (Number(wallet.balance) < amount) throw new BadRequestError('Insufficient balance')

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: { walletId: wallet.id, type: 'WITHDRAWAL', amount, status: 'COMPLETED' },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      }),
    ])

    return transaction
  },
}

import { prisma } from '../index'
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors'

type ShopData = {
  name: string
  description?: string
  logoUrl?: string
}

export const SellerService = {
  async listShops(page: number, limit: number) {
    const skip = (page - 1) * limit
    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        skip,
        take: limit,
        include: { owner: { select: { id: true, email: true } } },
      }),
      prisma.shop.count(),
    ])
    return { shops, total, page, pageSize: limit }
  },

  async getShop(id: number) {
    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, email: true } },
        products: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    })
    if (!shop) throw new NotFoundError('Shop not found')
    return shop
  },

  async createShop(ownerId: number, data: ShopData) {
    const existing = await prisma.shop.findUnique({ where: { name: data.name } })
    if (existing) throw new BadRequestError('Shop name already taken')
    return prisma.shop.create({ data: { ...data, ownerId } })
  },

  async updateShop(id: number, ownerId: number, data: Partial<ShopData>) {
    const shop = await prisma.shop.findUnique({ where: { id } })
    if (!shop) throw new NotFoundError('Shop not found')
    if (shop.ownerId !== ownerId) throw new ForbiddenError('You do not own this shop')
    return prisma.shop.update({ where: { id }, data })
  },

  async createSellerAccount(userId: number, shopId: number) {
    const existing = await prisma.sellerAccount.findUnique({ where: { userId } })
    if (existing) throw new BadRequestError('Seller account already exists')

    const shop = await prisma.shop.findUnique({ where: { id: shopId } })
    if (!shop) throw new NotFoundError('Shop not found')

    return prisma.sellerAccount.create({ data: { userId, shopId } })
  },

  async getSellerAccount(userId: number) {
    const account = await prisma.sellerAccount.findUnique({
      where: { userId },
      include: { shop: true },
    })
    if (!account) throw new NotFoundError('Seller account not found')
    return account
  },
}

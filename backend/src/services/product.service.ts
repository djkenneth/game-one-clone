import { prisma } from '../index'
import { NotFoundError } from '../utils/errors'

type ProductData = {
  name: string
  description?: string
  status?: string
  shopId: number
  categoryId: number
  brandId?: number
}

type VariantData = {
  sku: string
  price: number
  stock: number
  weight?: number
  isActive?: boolean
}

type ListOptions = {
  page: number
  limit: number
  search?: string
  categoryId?: number
  brandId?: number
}

export const ProductService = {
  async listProducts({ page, limit, search, categoryId, brandId }: ListOptions) {
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (categoryId) where.categoryId = categoryId
    if (brandId) where.brandId = brandId

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
          shop: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])
    return { products, total, page, pageSize: limit }
  },

  async getProduct(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        shop: { select: { id: true, name: true } },
        variants: { where: { isActive: true } },
      },
    })
    if (!product) throw new NotFoundError('Product not found')
    return product
  },

  async createProduct(data: ProductData) {
    return prisma.product.create({
      data,
      include: { category: true, brand: true },
    })
  },

  async updateProduct(id: number, data: Partial<ProductData>) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundError('Product not found')
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true, brand: true },
    })
  },

  async deleteProduct(id: number) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundError('Product not found')
    await prisma.product.delete({ where: { id } })
  },

  // --- Variants ---
  async listVariants(productId: number) {
    return prisma.productVariant.findMany({ where: { productId } })
  },

  async createVariant(productId: number, data: VariantData) {
    return prisma.productVariant.create({ data: { ...data, productId } })
  },

  async updateVariant(id: number, data: Partial<VariantData>) {
    const variant = await prisma.productVariant.findUnique({ where: { id } })
    if (!variant) throw new NotFoundError('Variant not found')
    return prisma.productVariant.update({ where: { id }, data })
  },

  async deleteVariant(id: number) {
    const variant = await prisma.productVariant.findUnique({ where: { id } })
    if (!variant) throw new NotFoundError('Variant not found')
    await prisma.productVariant.delete({ where: { id } })
  },

  // --- Categories ---
  async listCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      include: { children: true },
    })
  },

  async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true },
    })
    if (!category) throw new NotFoundError('Category not found')
    return category
  },

  async createCategory(data: { name: string; description?: string; parentId?: number }) {
    return prisma.category.create({ data })
  },

  async updateCategory(id: number, data: { name?: string; description?: string; isActive?: boolean }) {
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) throw new NotFoundError('Category not found')
    return prisma.category.update({ where: { id }, data })
  },

  // --- Brands ---
  async listBrands() {
    return prisma.brand.findMany()
  },

  async createBrand(data: { name: string; logoUrl?: string }) {
    return prisma.brand.create({ data })
  },

  async updateBrand(id: number, data: { name?: string; logoUrl?: string }) {
    return prisma.brand.update({ where: { id }, data })
  },

  async deleteBrand(id: number) {
    await prisma.brand.delete({ where: { id } })
  },
}

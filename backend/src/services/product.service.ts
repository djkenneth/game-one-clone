import { prisma } from '../index'
import { NotFoundError } from '../utils/errors'

type ProductData = {
  name: string
  handle?: string
  description?: string
  bodyHtml?: string
  productType?: string
  status?: string
  publishedAt?: string
  shopId: number
  categoryId: number
  brandId?: number
}

type VariantData = {
  sku: string
  title?: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  stock: number
  weight?: number
  barcode?: string
  position?: number
  taxable?: boolean
  inventoryPolicy?: string
  option1?: string
  option2?: string
  option3?: string
  isActive?: boolean
}

type ImageData = {
  url: string
  altText?: string
  position?: number
  width?: number
  height?: number
  variantId?: number
}

type OptionData = {
  name: string
  position?: number
  values: string[]
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
          images: { orderBy: { position: 'asc' }, take: 1 },
          tags: true,
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
        variants: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
          include: { images: { orderBy: { position: 'asc' } } },
        },
        images: { orderBy: { position: 'asc' } },
        options: {
          orderBy: { position: 'asc' },
          include: { values: { orderBy: { position: 'asc' } } },
        },
        tags: true,
      },
    })
    if (!product) throw new NotFoundError('Product not found')
    return product
  },

  async createProduct(data: ProductData) {
    return prisma.product.create({
      data,
      include: {
        category: true,
        brand: true,
        images: true,
        options: { include: { values: true } },
        tags: true,
      },
    })
  },

  async updateProduct(id: number, data: Partial<ProductData>) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundError('Product not found')
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        brand: true,
        images: true,
        options: { include: { values: true } },
        tags: true,
      },
    })
  },

  async deleteProduct(id: number) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundError('Product not found')
    await prisma.product.delete({ where: { id } })
  },

  // --- Variants ---
  async listVariants(productId: number) {
    return prisma.productVariant.findMany({
      where: { productId },
      orderBy: { position: 'asc' },
      include: { images: { orderBy: { position: 'asc' } } },
    })
  },

  async createVariant(productId: number, data: VariantData) {
    return prisma.productVariant.create({
      data: { ...data, productId },
      include: { images: true },
    })
  },

  async updateVariant(id: number, data: Partial<VariantData>) {
    const variant = await prisma.productVariant.findUnique({ where: { id } })
    if (!variant) throw new NotFoundError('Variant not found')
    return prisma.productVariant.update({
      where: { id },
      data,
      include: { images: true },
    })
  },

  async deleteVariant(id: number) {
    const variant = await prisma.productVariant.findUnique({ where: { id } })
    if (!variant) throw new NotFoundError('Variant not found')
    await prisma.productVariant.delete({ where: { id } })
  },

  // --- Images ---
  async addProductImage(productId: number, data: ImageData) {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new NotFoundError('Product not found')
    return prisma.productImage.create({ data: { ...data, productId } })
  },

  async deleteProductImage(id: number) {
    const image = await prisma.productImage.findUnique({ where: { id } })
    if (!image) throw new NotFoundError('Image not found')
    await prisma.productImage.delete({ where: { id } })
  },

  // --- Options ---
  async createProductOption(productId: number, data: OptionData) {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new NotFoundError('Product not found')
    return prisma.productOption.create({
      data: {
        productId,
        name: data.name,
        position: data.position ?? 0,
        values: {
          create: data.values.map((value, i) => ({ value, position: i })),
        },
      },
      include: { values: { orderBy: { position: 'asc' } } },
    })
  },

  async updateProductOption(id: number, data: { name?: string; position?: number }) {
    const option = await prisma.productOption.findUnique({ where: { id } })
    if (!option) throw new NotFoundError('Option not found')
    return prisma.productOption.update({
      where: { id },
      data,
      include: { values: { orderBy: { position: 'asc' } } },
    })
  },

  async deleteProductOption(id: number) {
    const option = await prisma.productOption.findUnique({ where: { id } })
    if (!option) throw new NotFoundError('Option not found')
    await prisma.productOption.delete({ where: { id } })
  },

  // --- Tags ---
  async addProductTag(productId: number, tag: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new NotFoundError('Product not found')
    return prisma.productTag.upsert({
      where: { productId_tag: { productId, tag } },
      update: {},
      create: { productId, tag },
    })
  },

  async removeProductTag(productId: number, tag: string) {
    await prisma.productTag.deleteMany({ where: { productId, tag } })
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

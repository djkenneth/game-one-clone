import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../index'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../plugins/auth'
import { NotFoundError } from '../utils/errors'

const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: z.string().optional(),
  shopId: z.number(),
  categoryId: z.number(),
  brandId: z.number().optional(),
})

const updateProductSchema = createProductSchema.partial()

export const productRouter = new Hono<AuthEnv>()

// Get all products
productRouter.get(
  '/',
  zValidator(
    'query',
    z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
    })
  ),
  async (c) => {
    const { page = '1', limit = '10', search } = c.req.valid('query')
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: parseInt(limit),
        include: { category: true },
        where,
      }),
      prisma.product.count({ where }),
    ])

    return c.json({
      success: true,
      data: { products, total, page: parseInt(page), pageSize: parseInt(limit) },
    })
  }
)

// Search products
productRouter.get(
  '/search',
  zValidator('query', z.object({ q: z.string() })),
  async (c) => {
    const { q } = c.req.valid('query')

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
    })

    return c.json({ success: true, data: { products } })
  }
)

// Get single product
productRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })

  if (!product) {
    throw new NotFoundError('Product not found')
  }

  return c.json({ success: true, data: { product } })
})

// Create product (admin only)
productRouter.post(
  '/',
  authMiddleware,
  isAdminMiddleware,
  zValidator('json', createProductSchema),
  async (c) => {
    const body = c.req.valid('json')

    const product = await prisma.product.create({
      data: body,
      include: { category: true },
    })

    return c.json({ success: true, data: { product } })
  }
)

// Update product (admin only)
productRouter.put(
  '/:id',
  authMiddleware,
  isAdminMiddleware,
  zValidator('json', updateProductSchema),
  async (c) => {
    const id = parseInt(c.req.param('id'))
    const body = c.req.valid('json')

    const product = await prisma.product.update({
      where: { id },
      data: body,
      include: { category: true },
    })

    return c.json({ success: true, data: { product } })
  }
)

// Delete product (admin only)
productRouter.delete('/:id', authMiddleware, isAdminMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'))

  await prisma.product.delete({ where: { id } })

  return c.json({ success: true, message: 'Product deleted successfully' })
})

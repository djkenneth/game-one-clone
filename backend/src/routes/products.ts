import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { auth, isAdmin } from '../plugins/auth'
import { NotFoundError } from '../utils/errors'
import { generateSlug } from '../utils/helpers'

export const productRouter = new Elysia({ prefix: '/products' })
  // Get all products
  .get('/', 
    async ({ query }) => {
      const { page = '1', limit = '10', ...filters } = query
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          skip,
          take: parseInt(limit as string),
          include: { categories: true },
          where: filters
        }),
        prisma.product.count({ where: filters })
      ])

      return {
        success: true,
        data: {
          products,
          total,
          page: parseInt(page as string),
          pageSize: parseInt(limit as string)
        }
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        search: t.Optional(t.String())
      }),
      detail: {
        tags: ['Products'],
        summary: 'List all products',
        description: 'Get paginated list of products with optional filters'
      }
    }
  )

  // Get single product
  .get('/:id',
    async ({ params: { id } }) => {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: { categories: true }
      })

      if (!product) {
        throw new NotFoundError('Product not found')
      }

      return {
        success: true,
        data: { product }
      }
    },
    {
      detail: {
        tags: ['Products'],
        summary: 'Get product by ID',
        description: 'Retrieve detailed information about a specific product'
      }
    }
  )

  .get('/search',
    async ({ query: { q } }) => {
      if (!q) return { products: [] }

      const searchQuery = q.toString()
      
      const products = await prisma.product.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            },
            {
              tags: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            }
          ]
        },
        include: {
          categories: true
        }
      })

      return {
        success: true,
        data: { products }
      }
    },
    {
      query: t.Object({
        q: t.String()
      }),
      detail: {
        tags: ['Products'],
        summary: 'Search products',
        description: 'Search products by title, description, or tags'
      }
    }
  )

  // Create product (admin only)
  .post('/',
    async ({ body }) => {
      const { title, categories, tags, ...rest } = body

      const product = await prisma.product.create({
        data: {
          ...rest,
          title,
          slug: generateSlug(title),
          tags: Array.isArray(tags) ? tags.join(',') : tags,
          categories: {
            connectOrCreate: categories.map(name => ({
              where: { name },
              create: { 
                name,
                slug: generateSlug(name)
              }
            }))
          }
        },
        include: {
          categories: true
        }
      })

      return {
        success: true,
        data: { product }
      }
    },
    {
      onBeforeHandle: [auth, isAdmin],
      body: t.Object({
        title: t.String(),
        price: t.Number(),
        availability: t.Boolean(),
        image: t.String(),
        description: t.String(),
        sku: t.String(),
        url: t.String(),
        categories: t.Array(t.String()),
        tags: t.Array(t.String())
      }),
      detail: {
        tags: ['Products'],
        summary: 'Create new product',
        description: 'Create a new product (Admin only)',
        security: [{ bearerAuth: [] }]
      }
    }
  )

  // Update product (admin only)
  .put('/:id',
    async ({ params: { id }, body }) => {
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          ...body,
          ...(body.title && { slug: generateSlug(body.title) }),
          ...(body.tags && { tags: Array.isArray(body.tags) ? body.tags.join(',') : body.tags }),
          ...(body.categories && {
            categories: {
              set: [],
              connectOrCreate: body.categories.map(name => ({
                where: { name },
                create: { 
                  name,
                  slug: generateSlug(name)
                }
              }))
            }
          })
        },
        include: {
          categories: true
        }
      })

      return {
        success: true,
        data: { product }
      }
    },
    {
      onBeforeHandle: [auth, isAdmin],
      detail: {
        tags: ['Products'],
        summary: 'Update product',
        description: 'Update an existing product (Admin only)',
        security: [{ bearerAuth: [] }]
      }
    }
  )

  // Delete product (admin only)
  .delete('/:id',
    async ({ params: { id } }) => {
      await prisma.product.delete({
        where: { id: parseInt(id) }
      })

      return {
        success: true,
        message: 'Product deleted successfully'
      }
    },
    {
      onBeforeHandle: [auth, isAdmin],
      detail: {
        tags: ['Products'],
        summary: 'Delete product',
        description: 'Delete an existing product (Admin only)',
        security: [{ bearerAuth: [] }]
      }
    }
  )
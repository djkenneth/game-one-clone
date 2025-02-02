import { Elysia, t } from 'elysia'
import { prisma } from '../index'
import { auth, isAdmin } from '../plugins/auth'
import { NotFoundError } from '../utils/errors'
import { generateSlug } from '../utils/helpers'

const ProductResponseType = t.Object({
  id: t.Number(),
  title: t.String(),
  slug: t.String(),
  price: t.Number(),
  description: t.String(),
  image: t.String(),
  availability: t.Boolean(),
  sku: t.String(),
  tags: t.String(),
  categories: t.Array(t.Object({
    id: t.Number(),
    name: t.String(),
    slug: t.String()
  }))
})

const ProductListResponseType = t.Object({
  success: t.Boolean(),
  data: t.Object({
    products: t.Array(ProductResponseType),
    total: t.Number(),
    page: t.Number(),
    pageSize: t.Number()
  })
})

export const productRouter = new Elysia({ prefix: '/products' })
  // Get all products
  .get('/', 
    async ({ query }) => {
      const { page = '1', limit = '10', ...filters } = query
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      const count = await prisma.product.count({
        where: filters
      })

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
        description: 'Get paginated list of products with optional filters',
        responses: {
          200: {
            description: 'Products retrieved successfully',
            content: {
              'application/json': {
                schema: ProductListResponseType
              }
            }
          }
        }
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
        description: 'Retrieve detailed information about a specific product',
        responses: {
          200: {
            description: 'Product found',
            content: {
              'application/json': {
                schema: t.Object({
                  success: t.Boolean(),
                  data: t.Object({
                    product: ProductResponseType
                  })
                })
              }
            }
          },
          404: {
            description: 'Product not found'
          }
        }
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
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: t.Object({
                  success: t.Boolean(),
                  data: t.Object({
                    product: ProductResponseType
                  })
                })
              }
            }
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin only'
          }
        }
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
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Product updated successfully'
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin only'
          },
          404: {
            description: 'Product not found'
          }
        }
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
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Product deleted successfully'
          },
          401: {
            description: 'Unauthorized'
          },
          403: {
            description: 'Forbidden - Admin only'
          },
          404: {
            description: 'Product not found'
          }
        }
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
        description: 'Search products by title, description, or tags',
        responses: {
          200: {
            description: 'Search results',
            content: {
              'application/json': {
                schema: t.Object({
                  success: t.Boolean(),
                  data: t.Object({
                    products: t.Array(ProductResponseType)
                  })
                })
              }
            }
          }
        }
      }
    }
  )
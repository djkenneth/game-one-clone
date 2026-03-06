// src/index.ts

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { AppError } from './utils/errors'

// Import routes
import { authRouter } from './routes/auth'
import { cartRouter } from './routes/cart'
import { orderRouter } from './routes/orders'
import { productRouter } from './routes/products'
import { userRouter } from './routes/users'
import { paymentRouter } from './routes/payment'
import { walletRouter } from './routes/wallet'
import { reviewRouter } from './routes/review'
import { sellerRouter } from './routes/seller'
import { catalogRouter } from './routes/catalog'
// Admin routes
import { adminRouter } from './routes/admin'

// Initialize Prisma with pg adapter (required in Prisma 7)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
export const prisma = new PrismaClient({ adapter })

// Create Hono app
const app = new Hono()

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
]

app.use(
  '*',
  cors({
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : allowedOrigins[0]),
    credentials: true,
  }),
)

// Global error handler
app.onError((err, c) => {
  console.error(`Error occurred: ${err.message}`)
  console.error(err.stack)

  if (err instanceof AppError) {
    return c.json(
      {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          ...(err.data && { data: err.data }),
        },
      },
      err.status as any
    )
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    return c.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Database operation failed',
        },
      },
      400
    )
  }

  if (err.name === 'ZodError') {
    return c.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
        },
      },
      422
    )
  }

  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    500
  )
})

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    },
    404
  )
})

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/swagger.json' }))
app.get('/swagger.json', (c) => {
  return c.json({
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API Documentation',
      version: '1.0.0',
      description: 'API documentation for the E-commerce platform',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {},
  })
})

// Mount routes under /api
const api = new Hono()
api.route('/auth', authRouter)
api.route('/products', productRouter)
api.route('/catalog', catalogRouter)
api.route('/cart', cartRouter)
api.route('/orders', orderRouter)
api.route('/users', userRouter)
api.route('/payment', paymentRouter)
api.route('/wallet', walletRouter)
api.route('/reviews', reviewRouter)
api.route('/sellers', sellerRouter)

// Admin routes — all protected by authMiddleware + isAdminMiddleware
api.route('/admin', adminRouter)

app.route('/api', api)

// Default route
app.get('/', (c) =>
  c.json({
    success: true,
    message: 'Welcome to the E-commerce API',
    documentation: '/swagger',
  })
)

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

console.log(`Server is running at http://localhost:${port}`)
console.log(`Swagger documentation at http://localhost:${port}/swagger`)

export default {
  port,
  fetch: app.fetch,
}

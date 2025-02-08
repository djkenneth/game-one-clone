// src/index.ts

import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import bearer from '@elysiajs/bearer';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { AppError } from './utils/errors';

import { PrismaClient } from '@prisma/client';

// Import routes
import { authRouter } from './routes/auth';
import { cartRouter } from './routes/cart';
import { orderRouter } from './routes/orders';
import { productRouter } from './routes/products';
import { userRouter } from './routes/users';


// Initialize Prisma
export const prisma = new PrismaClient().$extends({
    result: {
      address: {
        formattedAddress: {
          needs: {
            lineOne: true,
            lineTwo: true,
            city: true,
            country: true,
            pincode: true
          },
          compute: (addr) => {
            return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
          }
        }
      }
    }
  })

// Create Elysia app
const app = new Elysia()

    .use(swagger({
      documentation: {
        info: {
          title: 'E-commerce API Documentation',
          version: '1.0.0',
          description: 'API documentation for the E-commerce platform'
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        },
        security: [
          { bearerAuth: [] }
        ]
      },
      exclude: ['/']
    }))

    // Global error handler
    .onError(({ code, error, set }) => {
      console.error(`Error occurred: ${error.message}`)
      console.error(error.stack)
  
      if (error instanceof AppError) {
        set.status = error.status
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            ...(error.data && { data: error.data })
          }
        }
      }
  
      // Handle Prisma errors
      if (error.name === 'PrismaClientKnownRequestError') {
        set.status = 400
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Database operation failed'
          }
        }
      }
  
      // Handle validation errors
      if (error.name === 'ValidationError' || error.name === 'ZodError') {
        set.status = 422
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error?.errors || error?.issues
          }
        }
      }
  
      // Handle 404 errors
      if (code === 'NOT_FOUND') {
        set.status = 404
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Route not found'
          }
        }
      }
  
      // Default error handler
      set.status = 500
      return {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      }
    })
    

    .use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }))
    .use(bearer())
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!
      }))

    // Mount routes
    .group('/api', app => app
      .use(authRouter)
      .use(productRouter)
      .use(cartRouter)
      .use(orderRouter)
      .use(userRouter)
    )

    // Add a default route
    .get('/', () => ({
      success: true,
      message: 'Welcome to the E-commerce API',
      documentation: '/swagger'
    }))

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

app.listen(port, () => {
    console.log(`🦊 Server is running at http://localhost:${port}`)
    console.log(`📚 Swagger documentation at http://localhost:${port}/swagger`)
})
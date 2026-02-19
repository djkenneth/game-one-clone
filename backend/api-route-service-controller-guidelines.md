# API Route → Controller → Service Guidelines

## Architecture Overview

Every feature follows a strict four-layer pipeline:

```
HTTP Request
     ↓
Route        (src/routes/)       — registers path, attaches middleware & validators
     ↓
Controller   (src/controllers/)  — extracts request data, calls service, returns response
     ↓
Service      (src/services/)     — ALL business logic and ALL Prisma queries live here
     ↓
Prisma Client (prisma/schema.prisma) — database
```

---

## Folder Structure

```
src/
├── @types/           Global TypeScript ambient declarations (env vars, augmentations)
├── controllers/      Thin HTTP handlers — one file per domain
├── plugins/          Hono middleware (auth, etc.)
├── routes/           Route definitions — one file per domain
├── schema/           Zod input validation schemas — one file per domain
├── services/         Business logic + Prisma queries — one file per domain
└── utils/
    ├── errors.ts     AppError subclasses
    ├── helpers.ts    Pure utility functions
    └── constants.ts  App-wide constants
```

---

## Layer Responsibilities

### 1. Schema — `src/schema/{module}.ts`

- **Only** Zod schemas for validating **inbound request data**
- Named `{Action}{Model}Schema` — e.g. `CreateProductSchema`, `UpdateAddressSchema`
- Export reusable partial schemas via `.partial()`
- Never put DB types or Prisma imports here

```ts
// src/schema/products.ts
import { z } from 'zod'

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  shopId: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive().optional(),
})

export const UpdateProductSchema = CreateProductSchema.partial()
```

---

### 2. Service — `src/services/{module}.service.ts`

- **All Prisma queries live here** — nowhere else
- **All business logic lives here** — validation of business rules, orchestration
- Throws `AppError` subclasses on failure; never returns error objects
- Never touches the HTTP context (`c`) — takes plain arguments, returns plain data
- Export as a named object (`ProductService`, `CartService`, etc.)

```ts
// src/services/product.service.ts
import { prisma } from '../index'
import { NotFoundError, BadRequestError } from '../utils/errors'

export const ProductService = {
  async getProduct(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: true },
    })
    if (!product) throw new NotFoundError('Product not found')
    return product
  },

  async createProduct(data: { name: string; shopId: number; categoryId: number }) {
    return prisma.product.create({ data, include: { category: true } })
  },
}
```

---

### 3. Controller — `src/controllers/{module}.controller.ts`

- **Thin HTTP layer only** — no business logic, no Prisma
- Extracts validated body/params/query from context and passes to service
- Calls service and wraps result in the standard response envelope
- Uses `c.req.valid('json')` (validated upstream by `zValidator` in the route)
- Export as a named object (`ProductController`, `CartController`, etc.)

```ts
// src/controllers/product.controller.ts
import type { Context } from 'hono'
import type { AuthEnv } from '../plugins/auth'
import { ProductService } from '../services/product.service'

type C = Context<AuthEnv>

export const ProductController = {
  async getProduct(c: C) {
    const id = parseInt(c.req.param('id'))
    const product = await ProductService.getProduct(id)
    return c.json({ success: true, data: { product } })
  },

  async createProduct(c: C) {
    const body = c.req.valid('json' as any)
    const product = await ProductService.createProduct(body)
    return c.json({ success: true, data: { product } }, 201)
  },
}
```

---

### 4. Route — `src/routes/{module}.ts`

- Defines the URL structure and HTTP methods
- Applies middleware (`authMiddleware`, `isAdminMiddleware`)
- Attaches `zValidator` for request validation
- Calls controller methods — no logic beyond this
- Export a single `Hono` instance (e.g. `productRouter`)

```ts
// src/routes/products.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { CreateProductSchema, UpdateProductSchema } from '../schema/products'
import { ProductController } from '../controllers/product.controller'
import { authMiddleware, isAdminMiddleware, type AuthEnv } from '../plugins/auth'

export const productRouter = new Hono<AuthEnv>()

productRouter.get('/:id', ProductController.getProduct)

productRouter.post(
  '/',
  authMiddleware,
  isAdminMiddleware,
  zValidator('json', CreateProductSchema),
  ProductController.createProduct,
)
```

---

## Standard Response Format

All responses use the same envelope. Never deviate from this.

### Success — single resource
```json
{ "success": true, "data": { "product": { ... } } }
```

### Success — list with pagination
```json
{
  "success": true,
  "data": {
    "products": [...],
    "total": 120,
    "page": 2,
    "pageSize": 10
  }
}
```

### Success — mutation with no return body
```json
{ "success": true, "message": "Product deleted" }
```

### Error — handled globally in `src/index.ts`
```json
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "Product not found" }
}
```

---

## Error Handling

Throw typed errors from the **service layer**. The global error handler in `index.ts` catches them.

```ts
import { NotFoundError, BadRequestError, ForbiddenError, UnauthorizedError } from '../utils/errors'

// 404
if (!product) throw new NotFoundError('Product not found')

// 400
if (variant.stock < quantity) throw new BadRequestError('Insufficient stock')

// 403
if (user.id !== shop.ownerId) throw new ForbiddenError('Not your shop')

// 401
if (!user.isActive) throw new UnauthorizedError('Account is deactivated')
```

**Never** catch and swallow errors in services. Let them bubble to the global handler.

---

## Pagination Pattern

### Schema (reuse across routes)
```ts
const PaginationSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
})
```

### Service
```ts
async listProducts(page: number, limit: number) {
  const skip = (page - 1) * limit
  const [products, total] = await Promise.all([
    prisma.product.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.product.count(),
  ])
  return { products, total, page, pageSize: limit }
}
```

### Controller
```ts
async listProducts(c: C) {
  const { page = '1', limit = '10' } = c.req.valid('query' as any) as any
  const result = await ProductService.listProducts(parseInt(page), parseInt(limit))
  return c.json({ success: true, data: result })
}
```

---

## Auth Middleware

```ts
import { authMiddleware, isAdminMiddleware } from '../plugins/auth'

// Require any logged-in user
router.get('/profile', authMiddleware, Controller.method)

// Require ADMIN role (always chain after authMiddleware)
router.post('/', authMiddleware, isAdminMiddleware, zValidator('json', Schema), Controller.method)

// Protect all routes in a sub-router
const protectedRouter = new Hono<AuthEnv>()
protectedRouter.use('*', authMiddleware)
```

Access the authenticated user inside a controller:
```ts
const user = c.get('user') // type: User (from @prisma/client)
```

---

## HTTP Status Codes

| Situation | Status |
|---|---|
| GET / successful update | `200` |
| Resource created | `201` |
| Bad input / business rule violation | `400` |
| Not authenticated | `401` |
| Insufficient permission | `403` |
| Resource not found | `404` |
| Validation error (Zod) | `422` |
| Unexpected server error | `500` |

---

## Naming Conventions

| Artifact | File | Export name |
|---|---|---|
| Schema | `src/schema/users.ts` | `CreateUserSchema`, `UpdateUserSchema` |
| Service | `src/services/user.service.ts` | `UserService` |
| Controller | `src/controllers/user.controller.ts` | `UserController` |
| Router | `src/routes/users.ts` | `userRouter` |

---

## Checklist for Adding a New Endpoint

1. **Schema** — add Zod schema to `src/schema/{module}.ts`
2. **Service** — add method to `src/services/{module}.service.ts`
3. **Controller** — add handler to `src/controllers/{module}.controller.ts`
4. **Route** — register in `src/routes/{module}.ts`
5. **Index** — if new module, mount in `src/index.ts`

---

## Domain → Route Mapping

| Domain | Route prefix | Auth required |
|---|---|---|
| Auth | `/api/auth` | Signup/Login: no; `/me`: yes |
| Users | `/api/users` | Profile/Address: yes; Admin: ADMIN |
| Products | `/api/products` | Read: no; Write: ADMIN |
| Catalog | `/api/catalog` | Read: no; Write: ADMIN |
| Cart | `/api/cart` | All: yes |
| Orders | `/api/orders` | User: yes; Admin: ADMIN |
| Payment | `/api/payment` | User: yes; Status/Refund: ADMIN |
| Wallet | `/api/wallet` | All: yes |
| Reviews | `/api/reviews` | Read: no; Write: yes |
| Seller | `/api/seller` | Read: no; Write: yes |

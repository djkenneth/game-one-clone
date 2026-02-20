# One — Full Stack App

## Project Structure

```
one/
├── backend/    # Bun + Hono + Prisma API
├── frontend/   # React + Vite + Tailwind
└── package.json
```

## Getting Started

Install root dependencies:

```bash
bun install
```

Run both backend and frontend (backend starts first):

```bash
bun run dev
```

---

## Feature Backlog

### User-facing Features

| # | Feature | Backend Endpoint(s) |
|---|---------|-------------------|
| 1 | **Reviews** — display on product page | `GET /api/reviews/product/:id` |
| 2 | **Reviews** — submit after delivered order | `POST /api/reviews` |
| 3 | **Reviews** — My Reviews under `/account/reviews` | `GET /api/reviews/mine`, `DELETE /api/reviews/:id` |
| 4 | **Seller** — Become a Seller page | `POST /api/sellers/shops`, `POST /api/sellers/account` |
| 5 | **Seller** — Seller dashboard (shop + product/variant CRUD) | `/api/products`, `/api/products/:id/variants` |
| 6 | **Seller** — Seller orders view | `GET /api/orders` |
| 7 | **Shipment** — tracking timeline on order detail | order → shipment + events |
| 8 | **Checkout** — wire payment creation | `POST /api/payment` |
| 9 | **Wallet** — full paginated transaction history | `GET /api/wallet/transactions` |
| 10 | **Products** — brand & category filters on listing page | `GET /api/catalog/categories`, `/api/catalog/brands` |
| 11 | **Shops** — public shop listing + detail page | `GET /api/sellers/shops`, `/api/sellers/shops/:id` |

### Admin Dashboard (role-gated: `ADMIN`)

| # | Feature | Backend Endpoint(s) |
|---|---------|-------------------|
| 12 | Layout, sidebar, `ADMIN` route guard | — |
| 13 | **Users** — list, view, change role | `GET /api/users/admin`, `PUT /api/users/admin/:id/role` |
| 14 | **Products** — full CRUD + variants | `/api/products` (admin) |
| 15 | **Categories** — CRUD with parent/child hierarchy | `/api/catalog/categories` |
| 16 | **Brands** — CRUD | `/api/catalog/brands` |
| 17 | **Orders** — list all, filter by status, update status | `GET /api/orders/admin/orders`, `PUT .../status` |
| 18 | **Payments** — view, update status, process refunds | `PUT /api/payment/:id/status`, `POST /api/payment/refund` |

---

## Backend API Overview

Base URL: `/api`

| Resource | Public | Protected | Admin |
|----------|--------|-----------|-------|
| Auth | `POST /auth/signup`, `POST /auth/login` | `GET /auth/me` | — |
| Users | — | `GET/POST/PUT /users/profile`, `GET/POST/PUT/DELETE /users/address` | `GET/PUT /users/admin` |
| Products | `GET /products`, `GET /products/:id` | — | `POST/PUT/DELETE /products` |
| Catalog | `GET /catalog/categories`, `GET /catalog/brands` | — | `POST/PUT /catalog/categories`, `POST/PUT/DELETE /catalog/brands` |
| Cart | — | `GET/POST/PUT/DELETE /cart` | — |
| Orders | — | `GET/POST/PUT /orders` | `GET/PUT /orders/admin/orders` |
| Payment | — | `POST/GET /payment` | `PUT /payment/:id/status`, `POST /payment/refund` |
| Wallet | — | `GET /wallet`, `GET /wallet/transactions`, `POST /wallet/deposit`, `POST /wallet/withdraw` | — |
| Reviews | `GET /reviews/product/:id` | `POST /reviews`, `GET /reviews/mine`, `DELETE /reviews/:id` | — |
| Sellers | `GET /sellers/shops` | `POST/PUT /sellers/shops`, `GET/POST /sellers/account` | — |

Full Swagger docs available at `/swagger`.

---

## Database Models

| Schema | Models |
|--------|--------|
| UAC | `User`, `Profile`, `Address` |
| Seller | `Shop`, `SellerAccount` |
| Catalog | `Category`, `Brand`, `Product`, `ProductVariant` |
| Sales | `Cart`, `CartItem`, `Order`, `OrderItem` |
| Payment | `Payment`, `Refund` |
| Logistics | `Shipment`, `ShipmentEvent` |
| Wallet | `Wallet`, `Transaction` |
| Review | `Review` |

**Roles:** `ADMIN` · `USER` · `SELLER`

**Order statuses:** `PENDING` → `PAID` → `PROCESSING` → `SHIPPED` → `DELIVERED` · `CANCELLED` · `REFUNDED`

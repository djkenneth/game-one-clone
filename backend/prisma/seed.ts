import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashSync } from 'bcrypt'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // ─── Users ─────────────────────────────────────────────────────────────────

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashSync('admin123', 10),
      role: 'ADMIN',
    },
  })

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      password: hashSync('seller123', 10),
      role: 'SELLER',
    },
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashSync('user123', 10),
      role: 'USER',
    },
  })

  console.log(`  Users: ${admin.email}, ${sellerUser.email}, ${regularUser.email}`)

  // ─── Profiles ──────────────────────────────────────────────────────────────

  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, firstName: 'Admin', lastName: 'User', phone: '+1000000001' },
  })

  await prisma.profile.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: { userId: sellerUser.id, firstName: 'John', lastName: 'Seller', phone: '+1000000002' },
  })

  await prisma.profile.upsert({
    where: { userId: regularUser.id },
    update: {},
    create: { userId: regularUser.id, firstName: 'Jane', lastName: 'Doe', phone: '+1000000003' },
  })

  console.log('  Profiles created')

  // ─── Address ───────────────────────────────────────────────────────────────

  const existingAddress = await prisma.address.findFirst({ where: { userId: regularUser.id } })
  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: regularUser.id,
        fullName: 'Jane Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        phone: '+1000000003',
        isDefault: true,
      },
    })
    console.log('  Address created')
  }

  // ─── Shop & Seller Account ──────────────────────────────────────────────────

  const shop = await prisma.shop.upsert({
    where: { name: 'TechStore' },
    update: {},
    create: {
      ownerId: sellerUser.id,
      name: 'TechStore',
      description: 'Premium electronics and gadgets',
      status: 'ACTIVE',
    },
  })

  await prisma.sellerAccount.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      shopId: shop.id,
      verified: true,
      status: 'ACTIVE',
    },
  })

  console.log(`  Shop: ${shop.name}`)

  // ─── Brands ────────────────────────────────────────────────────────────────

  const apple = await prisma.brand.upsert({
    where: { name: 'Apple' },
    update: {},
    create: { name: 'Apple' },
  })

  const samsung = await prisma.brand.upsert({
    where: { name: 'Samsung' },
    update: {},
    create: { name: 'Samsung' },
  })

  const sony = await prisma.brand.upsert({
    where: { name: 'Sony' },
    update: {},
    create: { name: 'Sony' },
  })

  console.log('  Brands: Apple, Samsung, Sony')

  // ─── Categories ────────────────────────────────────────────────────────────
  // Category has no unique constraint on name — find-or-create

  const findOrCreateCategory = async (name: string, description?: string, parentId?: number) => {
    return (
      (await prisma.category.findFirst({ where: { name } })) ??
      (await prisma.category.create({ data: { name, description, parentId } }))
    )
  }

  const electronics = await findOrCreateCategory('Electronics', 'Electronic devices and accessories')
  const smartphones = await findOrCreateCategory('Smartphones', 'Mobile phones and accessories', electronics.id)
  const laptops = await findOrCreateCategory('Laptops', 'Laptops and notebooks', electronics.id)
  const audio = await findOrCreateCategory('Audio', 'Headphones, speakers and audio gear', electronics.id)

  console.log('  Categories: Electronics, Smartphones, Laptops, Audio')

  // ─── Products & Variants ───────────────────────────────────────────────────
  // Products have no unique constraint — only seed if none exist yet

  const productCount = await prisma.product.count()
  if (productCount === 0) {
    await prisma.product.create({
      data: {
        shopId: shop.id,
        categoryId: smartphones.id,
        brandId: apple.id,
        name: 'iPhone 15',
        description: 'Apple iPhone 15 with A16 Bionic chip, 6.1-inch display',
        status: 'ACTIVE',
        variants: {
          create: [
            { sku: 'IPH15-128-BLK', price: 799.99, stock: 50, weight: 0.171 },
            { sku: 'IPH15-256-BLK', price: 899.99, stock: 30, weight: 0.171 },
            { sku: 'IPH15-512-BLK', price: 1099.99, stock: 20, weight: 0.171 },
          ],
        },
      },
    })

    await prisma.product.create({
      data: {
        shopId: shop.id,
        categoryId: smartphones.id,
        brandId: samsung.id,
        name: 'Samsung Galaxy S24',
        description: 'Samsung Galaxy S24 with Snapdragon 8 Gen 3, 6.2-inch display',
        status: 'ACTIVE',
        variants: {
          create: [
            { sku: 'SGS24-128-BLK', price: 699.99, stock: 40, weight: 0.167 },
            { sku: 'SGS24-256-BLK', price: 799.99, stock: 25, weight: 0.167 },
          ],
        },
      },
    })

    await prisma.product.create({
      data: {
        shopId: shop.id,
        categoryId: laptops.id,
        brandId: apple.id,
        name: 'MacBook Air M3',
        description: 'Apple MacBook Air with M3 chip, 13-inch Liquid Retina display',
        status: 'ACTIVE',
        variants: {
          create: [
            { sku: 'MBA-M3-8-256', price: 1099.99, stock: 15, weight: 1.24 },
            { sku: 'MBA-M3-8-512', price: 1299.99, stock: 10, weight: 1.24 },
            { sku: 'MBA-M3-16-512', price: 1499.99, stock: 8, weight: 1.24 },
          ],
        },
      },
    })

    await prisma.product.create({
      data: {
        shopId: shop.id,
        categoryId: audio.id,
        brandId: sony.id,
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling wireless headphones',
        status: 'ACTIVE',
        variants: {
          create: [
            { sku: 'SNYWH-XM5-BLK', price: 349.99, stock: 60, weight: 0.25 },
            { sku: 'SNYWH-XM5-WHT', price: 349.99, stock: 45, weight: 0.25 },
          ],
        },
      },
    })

    await prisma.product.create({
      data: {
        shopId: shop.id,
        categoryId: laptops.id,
        brandId: samsung.id,
        name: 'Samsung Galaxy Book4 Pro',
        description: 'Samsung Galaxy Book4 Pro with Intel Core Ultra, 14-inch AMOLED display',
        status: 'ACTIVE',
        variants: {
          create: [
            { sku: 'SGBK4-16-512', price: 1199.99, stock: 12, weight: 1.55 },
            { sku: 'SGBK4-32-1TB', price: 1599.99, stock: 6, weight: 1.55 },
          ],
        },
      },
    })

    console.log('  Products: iPhone 15, Galaxy S24, MacBook Air M3, WH-1000XM5, Galaxy Book4 Pro')
  } else {
    console.log(`  Products: skipped (${productCount} already exist)`)
  }

  console.log('\nSeed complete!')
  console.log('\nTest accounts:')
  console.log('  admin@example.com   / admin123  (ADMIN)')
  console.log('  seller@example.com  / seller123 (SELLER)')
  console.log('  user@example.com    / user123   (USER)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

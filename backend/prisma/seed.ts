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
        handle: 'iphone-15',
        description: 'Apple iPhone 15 with A16 Bionic chip, 6.1-inch display',
        bodyHtml:
          '<p>The <strong>iPhone 15</strong> features the powerful A16 Bionic chip, a stunning 6.1-inch Super Retina XDR display, and an advanced dual-camera system. With Dynamic Island, USB-C connectivity, and all-day battery life, it redefines the smartphone experience.</p><ul><li>A16 Bionic chip</li><li>6.1" Super Retina XDR display</li><li>48MP main camera</li><li>USB-C connector</li><li>Up to 26 hours video playback</li></ul>',
        productType: 'Smartphone',
        status: 'ACTIVE',
        publishedAt: new Date(),
        images: {
          create: [
            { url: 'https://placehold.co/800x800?text=iPhone+15+Black', altText: 'iPhone 15 Black', position: 0 },
            { url: 'https://placehold.co/800x800?text=iPhone+15+Pink', altText: 'iPhone 15 Pink', position: 1 },
          ],
        },
        options: {
          create: [
            {
              name: 'Color',
              position: 0,
              values: { create: [{ value: 'Black', position: 0 }, { value: 'Pink', position: 1 }, { value: 'Blue', position: 2 }] },
            },
            {
              name: 'Storage',
              position: 1,
              values: { create: [{ value: '128GB', position: 0 }, { value: '256GB', position: 1 }, { value: '512GB', position: 2 }] },
            },
          ],
        },
        tags: { create: [{ tag: 'featured' }, { tag: 'new-arrival' }, { tag: 'apple' }] },
        variants: {
          create: [
            { sku: 'IPH15-128-BLK', title: '128GB / Black', price: 799.99, compareAtPrice: 849.99, costPrice: 600, stock: 50, weight: 0.171, position: 0, taxable: true, option1: 'Black', option2: '128GB' },
            { sku: 'IPH15-256-BLK', title: '256GB / Black', price: 899.99, compareAtPrice: 949.99, costPrice: 680, stock: 30, weight: 0.171, position: 1, taxable: true, option1: 'Black', option2: '256GB' },
            { sku: 'IPH15-512-BLK', title: '512GB / Black', price: 1099.99, costPrice: 820, stock: 20, weight: 0.171, position: 2, taxable: true, option1: 'Black', option2: '512GB' },
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
        handle: 'samsung-galaxy-s24',
        description: 'Samsung Galaxy S24 with Snapdragon 8 Gen 3, 6.2-inch display',
        bodyHtml:
          '<p>The <strong>Samsung Galaxy S24</strong> is powered by the Snapdragon 8 Gen 3 processor and features a 6.2-inch Dynamic AMOLED 2X display with 120Hz refresh rate. Galaxy AI brings powerful on-device intelligence to every interaction.</p><ul><li>Snapdragon 8 Gen 3</li><li>6.2" Dynamic AMOLED 2X, 120Hz</li><li>50MP triple camera</li><li>Galaxy AI features</li><li>4000 mAh battery</li></ul>',
        productType: 'Smartphone',
        status: 'ACTIVE',
        publishedAt: new Date(),
        images: {
          create: [
            { url: 'https://placehold.co/800x800?text=Galaxy+S24+Black', altText: 'Samsung Galaxy S24 Onyx Black', position: 0 },
            { url: 'https://placehold.co/800x800?text=Galaxy+S24+Violet', altText: 'Samsung Galaxy S24 Cobalt Violet', position: 1 },
          ],
        },
        options: {
          create: [
            {
              name: 'Color',
              position: 0,
              values: { create: [{ value: 'Onyx Black', position: 0 }, { value: 'Cobalt Violet', position: 1 }] },
            },
            {
              name: 'Storage',
              position: 1,
              values: { create: [{ value: '128GB', position: 0 }, { value: '256GB', position: 1 }] },
            },
          ],
        },
        tags: { create: [{ tag: 'featured' }, { tag: 'samsung' }, { tag: 'android' }] },
        variants: {
          create: [
            { sku: 'SGS24-128-BLK', title: '128GB / Onyx Black', price: 699.99, compareAtPrice: 799.99, costPrice: 520, stock: 40, weight: 0.167, position: 0, taxable: true, option1: 'Onyx Black', option2: '128GB' },
            { sku: 'SGS24-256-BLK', title: '256GB / Onyx Black', price: 799.99, costPrice: 600, stock: 25, weight: 0.167, position: 1, taxable: true, option1: 'Onyx Black', option2: '256GB' },
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
        handle: 'macbook-air-m3',
        description: 'Apple MacBook Air with M3 chip, 13-inch Liquid Retina display',
        bodyHtml:
          '<p>The <strong>MacBook Air M3</strong> is the world\'s best consumer laptop. With the M3 chip, up to 18 hours of battery life, and a fanless design, it delivers incredible performance in an impossibly thin body.</p><ul><li>Apple M3 chip</li><li>13.6" Liquid Retina display</li><li>Up to 18 hours battery life</li><li>Fanless, silent design</li><li>MagSafe charging</li></ul>',
        productType: 'Laptop',
        status: 'ACTIVE',
        publishedAt: new Date(),
        images: {
          create: [
            { url: 'https://placehold.co/800x800?text=MacBook+Air+M3+Midnight', altText: 'MacBook Air M3 Midnight', position: 0 },
            { url: 'https://placehold.co/800x800?text=MacBook+Air+M3+Starlight', altText: 'MacBook Air M3 Starlight', position: 1 },
          ],
        },
        options: {
          create: [
            {
              name: 'Memory',
              position: 0,
              values: { create: [{ value: '8GB', position: 0 }, { value: '16GB', position: 1 }] },
            },
            {
              name: 'Storage',
              position: 1,
              values: { create: [{ value: '256GB', position: 0 }, { value: '512GB', position: 1 }] },
            },
          ],
        },
        tags: { create: [{ tag: 'featured' }, { tag: 'apple' }, { tag: 'laptop' }, { tag: 'best-seller' }] },
        variants: {
          create: [
            { sku: 'MBA-M3-8-256', title: '8GB / 256GB', price: 1099.99, compareAtPrice: 1199.99, costPrice: 820, stock: 15, weight: 1.24, position: 0, taxable: true, option1: '8GB', option2: '256GB' },
            { sku: 'MBA-M3-8-512', title: '8GB / 512GB', price: 1299.99, costPrice: 960, stock: 10, weight: 1.24, position: 1, taxable: true, option1: '8GB', option2: '512GB' },
            { sku: 'MBA-M3-16-512', title: '16GB / 512GB', price: 1499.99, costPrice: 1100, stock: 8, weight: 1.24, position: 2, taxable: true, option1: '16GB', option2: '512GB' },
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
        handle: 'sony-wh-1000xm5',
        description: 'Industry-leading noise canceling wireless headphones',
        bodyHtml:
          '<p>The <strong>Sony WH-1000XM5</strong> headphones set the industry standard for noise cancellation. With 8 microphones and two processors, they deliver the best-ever noise canceling performance — plus exceptional 30-hour battery life and crystal-clear hands-free calling.</p><ul><li>Industry-leading noise cancellation</li><li>30-hour battery life</li><li>8 microphones for clear calling</li><li>Multipoint Bluetooth connection</li><li>Speak-to-Chat technology</li></ul>',
        productType: 'Headphones',
        status: 'ACTIVE',
        publishedAt: new Date(),
        images: {
          create: [
            { url: 'https://placehold.co/800x800?text=WH-1000XM5+Black', altText: 'Sony WH-1000XM5 Black', position: 0 },
            { url: 'https://placehold.co/800x800?text=WH-1000XM5+White', altText: 'Sony WH-1000XM5 White', position: 1 },
          ],
        },
        options: {
          create: [
            {
              name: 'Color',
              position: 0,
              values: { create: [{ value: 'Black', position: 0 }, { value: 'White', position: 1 }] },
            },
          ],
        },
        tags: { create: [{ tag: 'audio' }, { tag: 'sony' }, { tag: 'best-seller' }, { tag: 'wireless' }] },
        variants: {
          create: [
            { sku: 'SNYWH-XM5-BLK', title: 'Black', price: 349.99, compareAtPrice: 399.99, costPrice: 200, stock: 60, weight: 0.25, position: 0, taxable: true, barcode: '4548736133501', option1: 'Black' },
            { sku: 'SNYWH-XM5-WHT', title: 'White', price: 349.99, compareAtPrice: 399.99, costPrice: 200, stock: 45, weight: 0.25, position: 1, taxable: true, barcode: '4548736133518', option1: 'White' },
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
        handle: 'samsung-galaxy-book4-pro',
        description: 'Samsung Galaxy Book4 Pro with Intel Core Ultra, 14-inch AMOLED display',
        bodyHtml:
          '<p>The <strong>Samsung Galaxy Book4 Pro</strong> features Intel Core Ultra processors and a stunning 14-inch Dynamic AMOLED 2X display. With Galaxy AI integration, seamless ecosystem connectivity, and a slim premium design, it\'s built for professionals.</p><ul><li>Intel Core Ultra processor</li><li>14" Dynamic AMOLED 2X display</li><li>Galaxy AI features</li><li>Up to 22 hours battery</li><li>Wi-Fi 6E</li></ul>',
        productType: 'Laptop',
        status: 'ACTIVE',
        publishedAt: new Date(),
        images: {
          create: [
            { url: 'https://placehold.co/800x800?text=Galaxy+Book4+Pro+Moonstone+Gray', altText: 'Samsung Galaxy Book4 Pro Moonstone Gray', position: 0 },
          ],
        },
        options: {
          create: [
            {
              name: 'Memory',
              position: 0,
              values: { create: [{ value: '16GB', position: 0 }, { value: '32GB', position: 1 }] },
            },
            {
              name: 'Storage',
              position: 1,
              values: { create: [{ value: '512GB', position: 0 }, { value: '1TB', position: 1 }] },
            },
          ],
        },
        tags: { create: [{ tag: 'samsung' }, { tag: 'laptop' }, { tag: 'new-arrival' }] },
        variants: {
          create: [
            { sku: 'SGBK4-16-512', title: '16GB / 512GB', price: 1199.99, compareAtPrice: 1299.99, costPrice: 880, stock: 12, weight: 1.55, position: 0, taxable: true, option1: '16GB', option2: '512GB' },
            { sku: 'SGBK4-32-1TB', title: '32GB / 1TB', price: 1599.99, costPrice: 1180, stock: 6, weight: 1.55, position: 1, taxable: true, option1: '32GB', option2: '1TB' },
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

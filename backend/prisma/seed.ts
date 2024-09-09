import { PrismaClient } from '@prisma/client';
import { products } from '../data/products';
import { generateSlug } from '../src/lib/index'
const prisma = new PrismaClient();
async function main() {
    // To run the seed
    // npx prisma db seed
    await prisma.$transaction(products.map((product) => {
        return prisma.product.create({
            data: {
                title: product.title,
                price: product.price,
                availability: product.availability,
                image: product.image,
                description: product.description,
                sku: product.sku,
                url: product.url,
                slug: generateSlug(product.title),
                categories: {
                    connectOrCreate: [
                        { where: { name: product.categories[0] }, create: { name: product.categories[0], slug: generateSlug(product.categories[0]) } },
                        { where: { name: product.categories[1] }, create: { name: product.categories[1], slug: generateSlug(product.categories[1]) } },
                    ]
                }
            }
        })
    }))
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect()
    })
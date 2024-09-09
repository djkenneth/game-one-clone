import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../lib/index'

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { categories: true }
        });
        res.json(products);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something went wrong :(' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await prisma.product.findFirst({
            include: { categories: true },
            where: {
                id: parseInt(id)
            }
        })
        res.json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something went wrong :(' })
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, price, availability, image, description, sku, url, categories } = req.body;
        await prisma.product.create({
            data: {
                title,
                price,
                availability,
                image,
                description,
                sku,
                url,
                slug: await generateSlug(title),
                categories: {
                    connectOrCreate: [
                        { where: { name: categories[0] }, create: { name: categories[0] } },
                        { where: { name: categories[1] }, create: { name: categories[1] } },
                    ]
                }
            }
        })

        res.send({ message: "Successfully Created", status: 201 })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something went wrong :(' })
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await prisma.product.update({
            where: {
                id: parseInt(id)
            },
            data: data
        })
        res.send({ message: "Successfully Updated", status: 200 })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something went wrong :(' })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.product.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.send({ message: "Successfully Deleted", status: 200 })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something went wrong :(' })
    }
});

export default router;
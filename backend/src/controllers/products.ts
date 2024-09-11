import { Request, Response } from 'express';
import { prisma } from '../index'
import { generateSlug } from '../lib/index'

// Fetch All Products
export const getAllProduct = async (req: Request, res: Response) => {
    const payload = req.body;
    try {
        const products = await prisma.product.findMany({
            ...payload,
            include: { categories: true }
        });
        res.json(products);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something went wrong :(' })
    }
}

// Get Single Product
export const getOneProduct = async (req: Request, res: Response) => {
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
}

// Create Product Route
export const createProduct = async (req: Request, res: Response) => {
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
                slug: generateSlug(title),
                categories: {
                    connectOrCreate: [
                        { where: { name: categories[0] }, create: { name: categories[0], slug: generateSlug(categories[0]) } },
                        { where: { name: categories[1] }, create: { name: categories[1], slug: generateSlug(categories[1]) } },
                    ]
                }
            }
        })

        res.send({ message: "Successfully Created", status: 201 })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something went wrong :(' })
    }
}

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
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
}

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
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
}
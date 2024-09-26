import { Request, Response } from 'express';
import qs from 'qs';
import { prisma } from '../index'
import { generateSlug } from '../lib/index'
import { createProductSchema } from '../schema/products';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

const convertValuesToNumbers = (obj: any): any => {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            convertValuesToNumbers(obj[key]);
        } else if (!isNaN(obj[key])) {
            obj[key] = Number(obj[key]);
        }
    }
    return obj;
};

// Fetch All Products
export const getAllProduct = async (req: Request, res: Response) => {
    const { skip, take, ...filters } = req.query;

    // Parse query parameters into the correct format (this handles nested AND conditions)
    const parsedFilters = qs.parse(filters as any);

    // Convert string values to numbers where appropriate
    const convertedFilters = convertValuesToNumbers(parsedFilters);

    try {
        const count = await prisma.product.count()

        const products = await prisma.product.findMany({
            include: { categories: true },
            skip: parseInt(skip as string) || 0,
            take: parseInt(take as string) || 5,
            where: convertedFilters, // Apply dynamic filters
        });

        res.json({
            count,
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
}

// Get Single Product
export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const product = await prisma.product.findFirstOrThrow({
            include: { categories: true },
            where: {
                id: +id
            }
        })
        res.json(product)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

// Create Product Route
export const createProduct = async (req: Request, res: Response) => {

    createProductSchema.parse(req.body)
    const { title, tags, categories } = req.body;

    const product = await prisma.product.create({
        data: {
            ...req.body,
            tags: tags.join(','),
            slug: generateSlug(title),
            categories: {
                connectOrCreate: [
                    { where: { name: categories[0] }, create: { name: categories[0], slug: generateSlug(categories[0]) } },
                    { where: { name: categories[1] }, create: { name: categories[1], slug: generateSlug(categories[1]) } },
                ]
            }
        }
    })

    res.send(product)
}

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        const updateProduct = await prisma.product.update({
            where: {
                id: parseInt(id)
            },
            data: product
        })
        res.send(updateProduct)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const deleteProduct = await prisma.product.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.send(deleteProduct)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

// Search Products
export const searchProducts = async (req: Request, res: Response) => {
    // Implement pagination here
    const products = await prisma.product.findMany({
        where: {
            title: {
                search: req.query.q?.toString()
            },
            description: {
                search: req.query.q?.toString()
            },
            tags: {
                search: req.query.q?.toString()
            },
        }
    })

    res.json(products);
}
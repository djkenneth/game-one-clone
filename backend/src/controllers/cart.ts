import { Request, Response } from "express";
import { ChnageQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prisma } from "..";

export const addItemToCart = async (req: Request, res: Response) => {
    const validateData = CreateCartSchema.parse(req.body)
    let product: Product
    try {
        product = await prisma.product.findFirstOrThrow({
            where: {
                id: validateData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    const checkCartItem = await prisma.cartItem.findFirst({
        where: {
            userId: req.user.id,
            productId: product.id
        }
    })

    let cartItem;

    if (checkCartItem) {
        cartItem = await prisma.cartItem.update({
            where: {
                id: checkCartItem.id
            },
            data: {
                quantity: checkCartItem.quantity + validateData.quantity
            }
        })
    } else {
        cartItem = await prisma.cartItem.create({
            data: {
                userId: req.user.id,
                productId: product.id,
                quantity: validateData.quantity
            }
        })
    }

    res.json(cartItem)
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    try {
        await prisma.cartItem.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.json({ success: true })
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const changeQuantity = async (req: Request, res: Response) => {
    try {
        const validateData = ChnageQuantitySchema.parse(req.body)
        const { id } = req.params;

        const updateCart = await prisma.cartItem.update({
            where: {
                id: parseInt(id)
            },
            data: {
                quantity: validateData.quantity
            }
        })

        res.json(updateCart)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const getCart = async (req: Request, res: Response) => {
    const cart = await prisma.cartItem.findMany({
        where: {
            userId: req.user.id
        },
        include: {
            product: true
        }
    })

    res.json(cart)
}
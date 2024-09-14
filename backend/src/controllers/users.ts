import { Request, Response } from "express"
import { prisma } from ".."
import { AddressSchema, ProfileSchema, UpdateUserSchema } from "../schema/users"
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"
import { Address } from "@prisma/client"
import { BadRequestException } from "../exceptions/bad-request"

export const createAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body)

    const address = await prisma.address.create({
        data: {
            ...req.body,
            userId: req.user.id
        }
    })

    res.json(address);
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const deleteAddress = await prisma.address.delete({
            where: {
                id: parseInt(id)
            }
        })
        res.send(deleteAddress)
    } catch (error) {
        throw new NotFoundException('Address Not found', ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const listAddress = async (req: Request, res: Response) => {
    const addresses = await prisma.address.findMany({
        where: {
            userId: req.user.id
        }
    })

    res.json(addresses)
}

export const updateUser = async (req: Request, res: Response) => {
    const validatedData = UpdateUserSchema.parse(req.body)
    let shippingAddress: Address;
    let billingAddress: Address;
    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = await prisma.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            })

        } catch (error) {
            throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
        }
        if (shippingAddress.userId != req.user.id) {
            throw new BadRequestException('Address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }
    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = await prisma.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            })

        } catch (error) {
            throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
        }
        if (billingAddress.userId != req.user.id) {
            throw new BadRequestException('Address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: req.user.id
        },
        data: validatedData
    })
    res.json(updatedUser)
}

export const listUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        skip: parseInt(req.query.skip as string) || 0,
        take: parseInt(req.query.take as string) || 5
    })
    res.json(users)
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                addresses: true
            }
        })
        res.json(user)

    } catch (err) {
        throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND)
    }
}

export const changeUserRole = async (req: Request, res: Response) => {
    // Validation 
    try {
        const user = await prisma.user.update({
            where: {
                id: +req.params.id
            },
            data: {
                role: req.body.role
            }
        })
        res.json(user)

    } catch (err) {
        throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND)
    }
}

export const createProfile = async (req: Request, res: Response) => {
    ProfileSchema.parse(req.body)

    const profile = await prisma.profile.create({
        data: {
            ...req.body,
            userId: req.user.id
        }
    })

    res.json(profile);
}

export const getProfile = async (req: Request, res: Response) => {
    const profle = await prisma.address.findFirst({
        where: {
            userId: req.user.id
        }
    })

    res.json(profle)
}

export const updateProfile = async (req: Request, res: Response) => {
    const profile = req.body;
    const updateProfile = await prisma.profile.update({
        where: {
            userId: req.user.id
        },
        data: profile
    })

    res.send(updateProfile)
}
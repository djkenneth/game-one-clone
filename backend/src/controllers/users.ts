import { Request, Response } from "express"
import { prisma } from ".."
import { AddressSchema, ProfileSchema } from "../schema/users"
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"

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
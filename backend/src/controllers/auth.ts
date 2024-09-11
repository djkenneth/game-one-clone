import { Request, Response } from 'express';
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import prisma from '../prismaClient';
import { JWT_SECRET } from '../secret';

const saltRounds = 10;

// Signup User
export const signup = async (req: Request, res: Response) => {
    const { email, password, name } = req.body

    let user = await prisma.user.findFirst({ where: { email } })

    if (user) throw Error('User already exists!');

    user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashSync(password, saltRounds)
        }
    })

    res.json(user)
}

// Login User
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    let user = await prisma.user.findFirst({ where: { email } })

    if (!user) throw Error('User does noe exists!');

    if (!compareSync(password, user.password)) throw Error('User does noe exists!');

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({ user, token })
}
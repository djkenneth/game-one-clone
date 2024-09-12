import { NextFunction, Request, Response } from 'express';
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { prisma } from '../index'
import { JWT_SECRET } from '../secret';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { UnprocessableEntity } from '../exceptions/validation';
import { signUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';

const saltRounds = 10;

// Signup User
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    signUpSchema.parse(req.body)
    const { email, password, name } = req.body

    let user = await prisma.user.findFirst({ where: { email } })

    if (user) {
        next(new BadRequestException('User already exists!', ErrorCode.USER_ALREADY_EXISTS));
    }

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

    if (!user) throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND)
    if (!compareSync(password, user.password)) throw new BadRequestException('Incorrect password', ErrorCode.INCORRECT_PASSWORD);

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({ token })
}

// Profile
export const me = (req: Request, res: Response) => {
    res.json(req.user)
}
import { NextFunction, Request, Response } from 'express';
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { prisma } from '../index'
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../secret';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';
import { UnauthorizedException } from '../exceptions/unauthorized';

const saltRounds = 10;
const accessTokenExpiry = '1d'; // Access token expires in 1 day
const refreshTokenExpiry = '7d'; // Refresh token expires in 7 days

// Function to generate tokens
const generateTokens = (userId: number) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: accessTokenExpiry });
};

// Signup User
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body)
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

    res.json({ user });
}

// Login User
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    let user = await prisma.user.findFirst({ where: { email } })

    if (!user) throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND)
    if (!compareSync(password, user.password)) {
        throw new BadRequestException('Incorrect password', ErrorCode.INCORRECT_PASSWORD);
    }

    const accessToken = generateTokens(user.id);
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: refreshTokenExpiry });

    res.json({ accessToken, refreshToken });
}

// Token refresh
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return next(new BadRequestException('Refresh token is required', ErrorCode.REFRESH_TOKEN_REQUIRED));
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
        const accessToken = generateTokens(parseInt(decoded.userId));

        res.json({ accessToken });
    } catch (error) {
        return next(new UnauthorizedException('Invalid refresh token', ErrorCode.INVALID_REFRESH_TOKEN));
    }
};

// Profile
export const me = (req: Request, res: Response) => {
    res.json(req.user)
}
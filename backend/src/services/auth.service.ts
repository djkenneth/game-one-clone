import { hashSync, compareSync } from 'bcrypt'
import { sign } from 'hono/jwt'
import { prisma } from '../index'
import { BadRequestError, UnauthorizedError } from '../utils/errors'

const SALT_ROUNDS = 10

export const AuthService = {
  async signup(email: string, password: string) {
    const existing = await prisma.user.findFirst({ where: { email } })
    if (existing) throw new BadRequestError('User already exists')

    return prisma.user.create({
      data: { email, password: hashSync(password, SALT_ROUNDS) },
      select: { id: true, email: true, role: true, createdAt: true },
    })
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findFirst({ where: { email } })
    if (!user) throw new UnauthorizedError('Invalid credentials')
    if (!compareSync(password, user.password)) throw new UnauthorizedError('Invalid credentials')

    const accessToken = await sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!
    )
    return { user: { id: user.id, email: user.email, role: user.role }, accessToken }
  },

  async getMe(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, addresses: true },
    })
    if (!user) throw new UnauthorizedError('User not found')
    const { password: _pw, ...safeUser } = user
    return safeUser
  },
}

import { prisma } from '../index'
import { NotFoundError } from '../utils/errors'
import type { Role } from '@prisma/client'

type ProfileData = {
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  birthday?: string
}

type AddressData = {
  fullName: string
  street: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

export const UserService = {
  // --- Profile ---
  async createProfile(userId: number, data: ProfileData) {
    return prisma.profile.create({
      data: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        birthday: data.birthday ? new Date(data.birthday) : undefined,
      },
    })
  },

  async getProfile(userId: number) {
    const profile = await prisma.profile.findUnique({ where: { userId } })
    if (!profile) throw new NotFoundError('Profile not found')
    return profile
  },

  async updateProfile(userId: number, data: Partial<ProfileData>) {
    const profile = await prisma.profile.findUnique({ where: { userId } })
    if (!profile) throw new NotFoundError('Profile not found')
    return prisma.profile.update({
      where: { userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        birthday: data.birthday ? new Date(data.birthday) : undefined,
      },
    })
  },

  // --- Address ---
  async createAddress(userId: number, data: AddressData) {
    return prisma.address.create({ data: { ...data, userId } })
  },

  async getAddresses(userId: number) {
    return prisma.address.findMany({ where: { userId } })
  },

  async updateAddress(id: number, userId: number, data: AddressData) {
    const address = await prisma.address.findFirst({ where: { id, userId } })
    if (!address) throw new NotFoundError('Address not found')
    return prisma.address.update({ where: { id }, data })
  },

  async deleteAddress(id: number, userId: number) {
    const address = await prisma.address.findFirst({ where: { id, userId } })
    if (!address) throw new NotFoundError('Address not found')
    await prisma.address.delete({ where: { id } })
  },

  // --- Admin ---
  async listUsers(skip: number, take: number) {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        select: { id: true, email: true, role: true, isActive: true, createdAt: true },
      }),
      prisma.user.count(),
    ])
    return { users, total }
  },

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true, addresses: true },
    })
    if (!user) throw new NotFoundError('User not found')
    const { password: _pw, ...safeUser } = user
    return safeUser
  },

  async updateRole(id: number, role: Role) {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundError('User not found')
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    })
  },
}

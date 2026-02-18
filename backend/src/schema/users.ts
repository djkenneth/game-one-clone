// src/schema/users.ts

import { z } from 'zod'

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional(),
})

export const ProfileSchema = z.object({
  firstName: z.string(),
  middleName: z.string().nullable().optional(),
  lastName: z.string(),
  birthDate: z.string(),
  age: z.number(),
  profilePicture: z.string().nullable().optional(),
})

export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().optional(),
  city: z.string(),
  country: z.string(),
  pincode: z.string(),
})

export const ProfileInputSchema = z.object({
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  birthDate: z.string(),
  age: z.string(),
  profilePicture: z.string().optional(),
})

export const UpdateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'USER']),
})

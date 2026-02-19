import { z } from 'zod'

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const CreateProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  birthday: z.string().optional(),
})

export const UpdateProfileSchema = CreateProfileSchema.partial()

export const CreateAddressSchema = z.object({
  fullName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
})

export const UpdateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'USER', 'SELLER']),
})

import { z } from 'zod'

export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    city: z.string(),
    country: z.string(),
    pincode: z.string().min(4).max(6),
})

export const ProfileSchema = z.object({
    firstName: z.string(),
    middleName: z.string().nullable(),
    lastName: z.string(),
    birthDate: z.string(),
    age: z.number(),
    profilePicture: z.string().nullable(),
})
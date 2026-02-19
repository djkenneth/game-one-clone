import { z } from 'zod'

export const CreateShopSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
})

export const UpdateShopSchema = CreateShopSchema.partial()

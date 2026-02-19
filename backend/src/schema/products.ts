import { z } from 'zod'

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  shopId: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive().optional(),
})

export const UpdateProductSchema = CreateProductSchema.partial()

export const CreateVariantSchema = z.object({
  sku: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  weight: z.number().positive().optional(),
  isActive: z.boolean().optional().default(true),
})

export const UpdateVariantSchema = CreateVariantSchema.partial()

export const CreateCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  parentId: z.number().int().positive().optional(),
})

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

export const CreateBrandSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
})

export const UpdateBrandSchema = CreateBrandSchema.partial()

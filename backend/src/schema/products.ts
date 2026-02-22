import { z } from 'zod'

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  handle: z.string().min(1).optional(),
  description: z.string().optional(),
  bodyHtml: z.string().optional(),
  productType: z.string().optional(),
  status: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  shopId: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive().optional(),
})

export const UpdateProductSchema = CreateProductSchema.partial()

export const CreateVariantSchema = z.object({
  sku: z.string().min(1),
  title: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  weight: z.number().positive().optional(),
  barcode: z.string().optional(),
  position: z.number().int().min(0).optional().default(0),
  taxable: z.boolean().optional().default(true),
  inventoryPolicy: z.enum(['deny', 'continue']).optional().default('deny'),
  option1: z.string().optional(),
  option2: z.string().optional(),
  option3: z.string().optional(),
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

export const CreateProductImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
  position: z.number().int().min(0).optional().default(0),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  variantId: z.number().int().positive().optional(),
})

export const CreateProductOptionSchema = z.object({
  name: z.string().min(1),
  position: z.number().int().min(0).optional().default(0),
  values: z.array(z.string().min(1)).min(1),
})

export const UpdateProductOptionSchema = z.object({
  name: z.string().min(1).optional(),
  position: z.number().int().min(0).optional(),
})

export const AddProductTagSchema = z.object({
  tag: z.string().min(1),
})

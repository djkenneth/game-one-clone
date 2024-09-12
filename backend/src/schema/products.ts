import { z } from 'zod'

export const createProductSchema = z.object({
    title: z.string(),
    price: z.number(),
    availability: z.boolean(),
    image: z.string(),
    description: z.string(),
    sku: z.string(),
    url: z.string(),
    categories: z.string().array()
})
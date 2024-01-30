import z from 'zod'

const productsSchema = z.object({
  barcode: z.number({
    required_error: 'barcode is required'
  }),
  name: z.string(),
  img: z.string().url().optional(),
  costPrice: z.number().int().min(0).default(0),
  salePrice: z.number().int().min(0),
  wholeSalePrice: z.number().int().min(0).optional(),
  profit: z.number().int().min(0).nullish(),
  category: z.string().optional(),
  stock: z.number().int().min(0).nullish(),
  alertStock: z.number().int().min(0).nullish()

})

export function validateProduct (object) {
  return productsSchema.safeParse(object)
}

export function validatePartialProduct (input) {
  return productsSchema.partial().safeParse(input)
}

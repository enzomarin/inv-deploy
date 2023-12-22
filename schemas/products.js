const z = require('zod') // validaciones de datos

const productsSchema = z.object({
  barcode: z.number({
    required_error: 'barcode is required'
  }),
  name: z.string(),
  img: z.string().url().optional(),
  costPrice: z.number().int().min(0).default(0),
  salePrice: z.number().int().min(0),
  wholeSalePrice: z.number().int().min(0).optional(),
  category: z.string()
})

function validateProduct (object) {
  return productsSchema.safeParse(object)
}

function validatePartialProduct (input) {
  return productsSchema.partial().safeParse(input)
}

module.exports = {
  validateProduct,
  validatePartialProduct
}

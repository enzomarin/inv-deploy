import z from 'zod'

const businessSchema = z.object({
  rut: z.string({
    required_error: 'rut is required'
  }),
  name: z.string({
    required_error: 'name is required'
  }),
  address: z.string(),
  phonenumber: z.string().optional(),
  logo: z.string().optional(),
  userid: z.string()
})

export function validateBusiness (object) {
  return businessSchema.safeParse(object)
}

export function validatePartialBusiness (input) {
  return businessSchema.partial().safeParse(input)
}

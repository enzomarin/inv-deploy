import z from 'zod'

const shopSchema = z.object({
  name: z.string({
    required_error: 'name is required'
  }),
  address: z.string(),
  phonenumber: z.string().optional(),
  web: z.string().optional(),
  rol: z.string().optional(),
  userid: z.string()
})

export function validateShop (object) {
  return shopSchema.safeParse(object)
}

export function validatePartialShop (input) {
  return shopSchema.partial().safeParse(input)
}

import z from 'zod'

const ROLES = ['admin']
const userSchema = z.object({
  rut: z.string(),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string(),
  rol: z.enum(ROLES).default('admin'),
  subscriptionStatus: z.boolean().default(true),
  subscriptionEndDate: z.coerce.date().optional()
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}

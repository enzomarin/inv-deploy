import z from 'zod'

const userSchema = z.object({
  rut: z.string(),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string()
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}

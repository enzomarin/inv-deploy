import bcrypt from 'bcrypt'
const saltRounds = 10

export const encrypt = async (textplain) => {
  const hash = await bcrypt.hash(textplain, saltRounds)
  return hash
}

export const compare = async (passwordPlain, hashPassword) => {
  return await bcrypt.compare(passwordPlain, hashPassword)
}

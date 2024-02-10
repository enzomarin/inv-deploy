import jwt from 'jsonwebtoken'
import { AuthModel } from '../models/mysql/auth.js'
export const protect = async (req, res, next) => {
  try {
    const token = await req.cookies.token
    if (!token) {
      res.status(401).json({ message: 'Not authorized, please login' }) // eliminar .json cuando se agrege el middleware para manejar errores
      throw new Error('Not authorized, please login')
    }
    // Verificar token
    const result = jwt.verify(token, process.env.SECRET)
    // obtener el id del usuario desde el token
    const { email } = result
    const user = await AuthModel.findUserByEmail({ email })
    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }
    req.user = user
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Not authorized, please login')
  }
}

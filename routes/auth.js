import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'

export const createAuthRouter = ({ authModel }) => {
  const authController = new AuthController({ authModel })

  const registerRouter = Router()

  registerRouter.post('/register', authController.register)
  registerRouter.post('/login', authController.login)
  registerRouter.get('/logout', authController.logout)

  return registerRouter
}

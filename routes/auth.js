import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'
import { protect } from '../middleWare/authMiddleWare.js'

export const createAuthRouter = ({ authModel }) => {
  const authController = new AuthController({ authModel })

  const userRouter = Router()

  userRouter.post('/register', authController.register)
  userRouter.post('/login', authController.login)
  userRouter.get('/logout', authController.logout)
  userRouter.get('/profile', protect, authController.getProfile)
  userRouter.patch('/updateuser', protect, authController.updateUser)
  return userRouter
}

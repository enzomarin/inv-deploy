import { Router } from 'express'
import { BusinessController } from '../controllers/business.js'
export const createBusinessRouter = ({ businessModel }) => {
  const businessRouter = Router()
  const businessController = new BusinessController({ businessModel })

  businessRouter.post('/', businessController.create)

  return businessRouter
}

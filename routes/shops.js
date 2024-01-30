import { Router } from 'express'
import { ShopController } from '../controllers/shop.js'
export const createShopRouter = ({ shopModel }) => {
  const shopRouter = Router()
  const shopController = new ShopController({ shopModel })

  shopRouter.post('/', shopController.create)

  return shopRouter
}

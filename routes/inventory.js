import { Router } from 'express'
import { InventoryController } from '../controllers/inventory.js'

export const createInventoryRouter = ({ inventoryModel }) => {
  const inventoryRouter = Router()
  const inventoryController = new InventoryController({ inventoryModel })
  inventoryRouter.post('/addProduct/:businessId', inventoryController.createProduct)
  inventoryRouter.get('/products/:businessId', inventoryController.getAllProducts)
  // inventoryRouter.get('/:businessId/:productId', inventoryController.getProductById)
  inventoryRouter.get('/product/:businessId', inventoryController.getProduct)

  return inventoryRouter
}

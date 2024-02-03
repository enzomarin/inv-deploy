import { Router } from 'express'
import { InventoryController } from '../controllers/inventory.js'

export const createInventoryRouter = ({ inventoryModel }) => {
  const inventoryRouter = Router()
  const inventoryController = new InventoryController({ inventoryModel })
  inventoryRouter.post('/addProduct/:businessId', inventoryController.createProduct)
  inventoryRouter.get('/:businessId', inventoryController.getAllProducts)

  return inventoryRouter
}

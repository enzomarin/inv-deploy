import { Router } from 'express'
import { ProductController } from '../controllers/products.js'

export const createProductRouter = ({ productsModel }) => {
  const productsRouter = Router()

  const productController = new ProductController({ productsModel })

  productsRouter.get('/', productController.getAll)

  productsRouter.get('/:id', productController.getById)

  productsRouter.post('/', productController.create)

  productsRouter.patch('/:id', productController.update)

  productsRouter.delete('/:id', productController.delete)

  return productsRouter
}

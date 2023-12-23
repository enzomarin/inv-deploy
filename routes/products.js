import { Router } from 'express'
import { ProductController } from '../controllers/products.js'

export const productsRouter = Router()

productsRouter.get('/', ProductController.getAll)

productsRouter.get('/:id', ProductController.getById)

productsRouter.post('/', ProductController.create)

productsRouter.patch('/', ProductController.update)
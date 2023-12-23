import { ProductsModel } from '../models/products.js'
import { validatePartialProduct, validateProduct } from '../schemas/products.js'

export class ProductController {
  static async getAll (req, res) {
    try {
      const { category } = req.query
      const products = await ProductsModel.getAll({ category })
      res.json(products)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getById (req, res) {
    const { id } = req.params
    const product = await ProductsModel.getById({ id })
    if (product) return res.json(product)
    res.status(404).json({ message: 'Producto no encontrado' })
  }

  static async create (req, res) {
    const result = validateProduct(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newProduct = await ProductsModel.createProduct({ input: result.data })

    res.status(201).json(newProduct)
  }

  static async update (req, res) {
    const result = validatePartialProduct(req.body)
    if (result.error) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedProduct = await ProductsModel.update({ id, input: result.data })

    res.json(updatedProduct)
  }
}

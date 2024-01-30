// import { ProductsModel } from '../models/products.js'
// import { ProductsModel } from '../models/mysql/product.js'
import { validatePartialProduct, validateProduct } from '../schemas/products.js'

export class ProductController {
  constructor ({ productsModel }) {
    this.productsModel = productsModel
  }

  getAll = async (req, res) => {
    try {
      const { category } = req.query
      const products = await this.productsModel.getAll({ category })
      res.json(products)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  getById = async (req, res) => {
    const { id } = req.params
    const product = await this.productsModel.getById({ id })
    if (product) return res.json(product)
    res.status(404).json({ message: 'Producto no encontrado' })
  }

  create = async (req, res) => {
    const result = validateProduct(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newProduct = await this.productsModel.create({ input: result.data })

    res.status(201).json(newProduct)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.productsModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.json({ message: 'Product deleted' })
  }

  update = async (req, res) => {
    const result = validatePartialProduct(req.body)
    if (result.error) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedProduct = await this.productsModel.update({ id, input: result.data })
    if (updatedProduct) return res.status(201).json(updatedProduct)

    return res.status(400).json({ message: 'Product not found' })
  }
}

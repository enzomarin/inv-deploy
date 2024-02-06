import { validateProduct } from '../schemas/products.js'

export class InventoryController {
  constructor ({ inventoryModel }) {
    this.inventoryModel = inventoryModel
  }

  createProduct = async (req, res, next) => {
    const { businessId } = req.params
    const result = validateProduct(req.body)
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const newProduct = await this.inventoryModel.addProduct({ businessId, input: result.data })
      return res.status(201).json(newProduct)
    } catch (err) {
      console.log(err)
      // throw new Error('Error al crear el producto')
      next(() => console.log('ocurrio un error!!!!'))
    }
  }

  getAllProducts = async (req, res) => {
    const { businessId } = req.params
    const { category } = req.query
    try {
      const products = await this.inventoryModel.getAllProducts({ businessId, category })

      return res.json(products)
    } catch (err) {
      res.status(404).json({ message: err.message })
    }
  }

  getProduct = async (req, res) => {
    const { barcode } = req.query
    console.log(barcode)
    try {
      const product = await this.inventoryModel.getProduct({ barcode })
      return res.json(product)
    } catch (err) {
      res.status(404).json({ message: 'No se encontro el producto' })
    }
  }

  getProductById = async (req, res) => {
    const { productId } = req.params

    try {
      const product = await this.inventoryModel.getProductById({ id: productId })
      if (product) return res.json(product)

      res.status(404).json({ message: 'Producto no encontrado' })
    } catch (err) {
      throw new Error('Algo salio mal al obtener el producto')
    }
  }
}

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
    try {
      const products = await this.inventoryModel.getAllProducts({ businessId })

      return res.json(products)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
}

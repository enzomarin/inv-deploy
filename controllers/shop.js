import { ShopModel } from '../models/mysql/shop.js'
import { validateShop } from '../schemas/shop.js'

export class ShopController {
  constructor ({ shopModel }) {
    this.shopModel = shopModel
  }

  create = async (req, res) => {
    const result = validateShop(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newShop = await ShopModel.create({ input: result.data })
    res.status(201).json(newShop)
  }
}

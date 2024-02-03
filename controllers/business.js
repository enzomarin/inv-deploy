import { validateBusiness } from '../schemas/business.js'

export class BusinessController {
  constructor ({ businessModel }) {
    this.businessModel = businessModel
  }

  create = async (req, res) => {
    const result = validateBusiness(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newBusiness = await this.businessModel.create({ input: result.data })
    res.status(201).json(newBusiness)
  }
}

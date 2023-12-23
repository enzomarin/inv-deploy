import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'
const require = createRequire(import.meta.url)
const products = require('../products.json')

export class ProductsModel {
  static getAll = async ({ category }) => {
    if (category) {
      return products.filter(product => product.category.toLowerCase() === category.toLowerCase())
    }
    return products
  }

  static async getById ({ id }) {
    const product = products.find(product => product.productId === id)
    return product
  }

  static async createProduct ({ input }) {
    const newProduct = {
      id: randomUUID(), // UUID V4
      ...input
    }
    products.push(newProduct)
    return newProduct
  }

  static async update ({ id, input }) {
    const productIndex = products.findIndex(product => product.productId === id)

    if (productIndex < 0) return false

    const updateProduct = {
      ...products[productIndex],
      ...input
    }
    products[productIndex] = updateProduct

    return updateProduct
  }
}

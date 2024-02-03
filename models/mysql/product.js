import 'dotenv/config'

import { connectionDb } from '../../utils/mySqlConnection.js'

export class ProductsModel {
  static async getAll ({ category }) {
    if (category) {
      const lowerCaseCategory = category.toLowerCase()

      const [categories] = await connectionDb.query('SELECT id, name FROM categories WHERE LOWER(name) = ?;', [lowerCaseCategory])

      if (categories.length === 0) return []

      const [{ catId }] = categories

      const [products] = await connectionDb.query('SELECT * FROM products WHERE category = ?;', [catId])

      return products
    }
    const [products] = await connectionDb.query('SELECT * FROM products;')
    return products
  }

  static async getById ({ id }) {
    const [product] = await connectionDb.query('SELECT id, barcode, products.name,salePrice, categories.name as category FROM products JOIN categories ON products.categoryId = categories.catId WHERE productId= ?;', [id])

    if (product.length === 0) return null

    return product[0]
  }

  static async create ({ input }) {
    const {
      barcode,
      name,
      img,
      costPrice,
      salePrice,
      wholeSalePrice,
      profit,
      category,
      stock,
      alertStock

    } = input
    const [cat] = await connectionDb.query('SELECT * FROM categories WHERE name = ?;', [category])
    const [{ catId }] = cat
    console.log('catID: ', catId)
    try {
      const resultProduct = await connectionDb.query('INSERT INTO products(barcode, name, img, costPrice, salePrice, wholesalePrice, profit, categoryId) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);', [barcode, name, img, costPrice, salePrice, wholeSalePrice, profit, catId ?? 0])
      const [{ insertId }] = resultProduct
      await connectionDb.query('INSERT INTO product_prices_history(productId, costPrice, salePrice) VALUES (?,?,?)', [insertId, costPrice, salePrice])

      const [products] = await connectionDb.query('SELECT id, barcode, products.name,salePrice, categories.name as category FROM products JOIN categories ON products.categoryId = categories.catId WHERE id= ?;', [insertId])

      return products[0]
    } catch (err) {
      throw new Error(err)
    }
  }

  static async delete ({ id }) {
    const result = await connectionDb.query('DELETE FROM products WHERE productId = ?', [id])
    const [{ affectedRows }] = result
    if (affectedRows > 0) return true
    return false
  }

  static async update ({ id, input }) {
    const { costPrice, salePrice } = input
    const result = await connectionDb.query('UPDATE products SET ? WHERE id = ?;', [input, id])
    const [{ affectedRows }] = result
    if (affectedRows > 0) {
      if (costPrice && salePrice) {
        await connectionDb.query('INSERT INTO product_prices_history(productId, costPrice, salePrice) VALUES (?,?,?)', [id, costPrice, salePrice])
      }
    }
    const [products] = await connectionDb.query('SELECT * FROM products WHERE id = ?;', [id])
    return products[0]
  }
}

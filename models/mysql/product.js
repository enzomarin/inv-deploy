import mysql from 'mysql2/promise'
import 'dotenv/config'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'inventorydb'
}
const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
console.log(connectionString)
const connection = await mysql.createConnection(connectionString)

export class ProductsModel {
  static async getAll ({ category }) {
    if (category) {
      const lowerCaseCategory = category.toLowerCase()

      const [categories] = await connection.query('SELECT id, name FROM categories WHERE LOWER(name) = ?;', [lowerCaseCategory])

      if (categories.length === 0) return []

      const [{ catId }] = categories

      const [products] = await connection.query('SELECT * FROM products WHERE category = ?;', [catId])

      return products
    }
    const [products] = await connection.query('SELECT * FROM products;')
    return products
  }

  static async getById ({ id }) {
    const [product] = await connection.query('SELECT productId, barcode, products.name,salePrice, categories.name as category FROM products JOIN categories ON products.category = categories.catId WHERE productId= ?;', [id])

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
      category,
      stock,
      alertStock,
      profit
    } = input

    const [cat] = await connection.query('SELECT * FROM categories WHERE name = ?;', [category])
    const [{ catId }] = cat
    try {
      const result = await connection.query('INSERT INTO products(barcode, name, img, costPrice, salePrice, wholesalePrice, category) VALUES ( ?, ?, ?, ?, ?, ?, ?);', [barcode, name, img, costPrice, salePrice, wholeSalePrice, catId])

      const [{ insertId }] = result
      const [products] = await connection.query('SELECT productId, barcode, products.name,salePrice, categories.name as category FROM products JOIN categories ON products.category = categories.catId WHERE productId= ?;', [insertId])

      return products[0]
    } catch (err) {
      throw new Error('error al crear el producto')
    }
  }

  static async delete ({ id }) {
    const result = await connection.query('DELETE FROM products WHERE productId = ?', [id])
    const [{ affectedRows }] = result
    if (affectedRows > 0) return true
    return false
  }

  static async update ({ id, input }) {
    await connection.query('UPDATE products SET ? WHERE productId = ?;', [input, id])
    const [products] = await connection.query('SELECT * FROM products WHERE productId = ?;', [id])
    return products[0]
  }
}

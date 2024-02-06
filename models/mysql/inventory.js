import { connectionDb } from '../../utils/mySqlConnection.js'

export class InventoryModel {
  static async addProduct ({ businessId, input }) {
    const {
      barcode,
      name,
      img,
      costPrice,
      salePrice,
      wholeSalePrice,
      profit,
      trackInventory,
      category,
      stock,
      alertStock
    } = input
    try {
      const [cat] = await connectionDb.query('SELECT * FROM categories WHERE name= ?;', [category])
      const [{ catId }] = cat

      const resultProduct = await connectionDb.query('INSERT INTO products(barcode, name, img, costPrice, salePrice, wholesalePrice, profit, trackInventory, categoryId) VALUES (?,?,?,?,?,?,?,?,?)', [barcode, name, img, costPrice, salePrice, wholeSalePrice, profit, trackInventory, catId ?? 0])
      const [{ affectedRows }] = resultProduct
      if (affectedRows > 0) {
        console.log(businessId)
        const [{ insertId }] = resultProduct
        await connectionDb.query('INSERT INTO product_prices_history (productId, costPrice, salePrice) VALUES (?,?,?)', [insertId, costPrice, salePrice])
        await connectionDb.query('INSERT INTO product_inventory (businessId,productId,stock,alertStock) VALUES (UUID_TO_BIN(?),?,?,?);', [businessId, insertId, stock, alertStock])

        const [products] = await connectionDb.query('SELECT p.barcode, p.name, p.img, p.costPrice, p.salePrice, p.wholesalePrice, p.profit, p.trackInventory, p.categoryId, businessId, stock, alertStock FROM product_inventory JOIN products AS p ON p.id = product_inventory.productId  WHERE productId= ?;', [insertId])

        return products[0]
      } else {
        console.log('algo fallo!')
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  static async getAllProducts ({ businessId, category }) {
    try {
      if (category) {
        const lowerCaseCategory = category.toLowerCase()
        const [categories] = await connectionDb.query('SELECT * FROM categories WHERE name = ?', [lowerCaseCategory])
        if (categories.length === 0) return []

        const { catId } = categories[0]
        console.log(catId)
        const [products] = await connectionDb.query('SELECT * FROM products WHERE categoryId = ?', [catId])

        return products
      }
      const [products] = await connectionDb.query('SELECT barcode, products.name, img, costPrice, salePrice, wholesalePrice, profit, c.name AS category, trackInventory, pv.stock, pv.alertStock FROM products JOIN product_inventory AS pv ON products.id = pv.productId JOIN categories AS c ON products.categoryId = c.catId WHERE pv.businessId = UUID_TO_BIN(?) ;', [businessId])
      return products
    } catch (err) {
      throw new Error(err)
    }
  }
}

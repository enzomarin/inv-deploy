import { connectionDb } from '../../utils/mySqlConnection.js'

export class ShopModel {
  static async create ({ input }) {
    const { name, address, phonenumber, web, rol, userid } = input
    try {
      const result = await connectionDb.query('INSERT INTO shops(shopName, address, phonenumber, web, rol, userId) VALUES (?,?,?,?,?,UUID_TO_BIN(?));', [name, address, phonenumber, web, rol, userid])
      return result
    } catch (err) {
      throw new Error('Error al crear tienda!')
    }
  }
}

import { connectionDb } from '../../utils/mySqlConnection.js'

export class BusinessModel {
  static async create ({ input }) {
    const { rut, name, address, phonenumber, logo, userid } = input
    try {
      const result = await connectionDb.query('INSERT INTO business(rut,businessName, address, phonenumber, logo, userId) VALUES (?,?,?,?,?,UUID_TO_BIN(?));', [rut, name, address, phonenumber, logo, userid])
      return result
    } catch (err) {
      throw new Error('Error al crear tienda!')
    }
  }
}

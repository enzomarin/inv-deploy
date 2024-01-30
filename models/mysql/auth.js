import 'dotenv/config'

import { connectionDb } from '../../utils/mySqlConnection.js'

export class AuthModel {
  static async register ({ rut, email, passwordHash, rol, subscriptionStatus, subscriptionEndDate }) {
    try {
      const result = await connectionDb.query('INSERT INTO users(rut, email, password, rol, subscriptionStatus,  subscriptionEndDate) VALUES (?,?,?,?,?,?);', [rut, email, passwordHash, rol, subscriptionStatus, subscriptionEndDate])
      return result
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('La dirección de correo electronico ya esta en uso.')
      } else {
        console.log(error)
        throw new Error('Error durante el registro.')
      }
    }
  }

  static async findUser ({ email }) {
    const [user] = await connectionDb.query('SELECT * FROM users WHERE email = ?;', [email])
    return user[0]
  }
}

import mysql from 'mysql2/promise'
import 'dotenv/config'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'inventorydb'
}
// const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const connectionString = DEFAULT_CONFIG
console.log(connectionString)
const connection = await mysql.createConnection(connectionString)

export class AuthModel {
  static async register ({ rut, email, passwordHash }) {
    try {
      const result = await connection.query('INSERT INTO users(rut, email, password) VALUES (?,?,?);', [rut, email, passwordHash])
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
    const [user] = await connection.query('SELECT * FROM users WHERE email = ?;', [email])
    return user[0]
  }
}

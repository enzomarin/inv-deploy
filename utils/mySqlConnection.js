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
export const connectionDb = await mysql.createConnection(connectionString)

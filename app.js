import express, { json } from 'express'
import cors from 'cors'
import { createProductRouter } from './routes/products.js'
import { createBusinessRouter } from './routes/business.js'
import { createAuthRouter } from './routes/auth.js'
import { createInventoryRouter } from './routes/inventory.js'
import { ProductsModel } from './models/mysql/product.js'
import { AuthModel } from './models/mysql/auth.js'
import { InventoryModel } from './models/mysql/inventory.js'
import 'dotenv/config'
import { BusinessModel } from './models/mysql/business.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleWare/errorMiddleware.js'

const app = express()

const PORT = process.env.PORT ?? 1234

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Cambia esto al dominio de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Esto permite el uso de cookies
  optionsSuccessStatus: 204
}

app.use(json()) // middleware para mutar req.body
app.use(cookieParser())
// app.use(cors())
app.use(cors(corsOptions))
app.use((req, res, next) => {
  // TODO: revisar si el usuario está logeado
  console.log('midleware')
  next()
})

app.get('/', (req, res) => {
  res.status(200).send('<h1>Inventario</h1>')
})

app.use('/auth', createAuthRouter({ authModel: AuthModel }))
app.use('/products', createProductRouter({ productsModel: ProductsModel }))
app.use('/business', createBusinessRouter({ businessModel: BusinessModel }))
app.use('/inventory', createInventoryRouter({ inventoryModel: InventoryModel }))

// error middleware
app.use(errorHandler)

// .use para todos los metodos (get, post, etc...)
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto: http://localhost:${PORT}`)
})

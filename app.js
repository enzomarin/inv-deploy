import express, { json } from 'express'
import cors from 'cors'
import { createProductRouter } from './routes/products.js'
import { ProductsModel } from './models/mysql/product.js'
import 'dotenv/config'

const app = express()

const PORT = process.env.PORT ?? 1234

app.use(json()) // middleware para mutar req.body
app.use(cors())
app.use((req, res, next) => {
  // revisar si el usuario está logeado
  console.log('midleware')
  next()
})

app.get('/', (req, res) => {
  res.status(200).send('<h1>Inventario</h1>')
})

app.use('/products', createProductRouter({ productsModel: ProductsModel }))

// .use para todos los metodos (get, post, etc...)
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto: http://localhost:${PORT}`)
})

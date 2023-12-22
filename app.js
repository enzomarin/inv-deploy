const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const products = require('./products.json')
const { validateProduct, validatePartialProduct } = require('./schemas/products')
const app = express()

const PORT = process.env.PORT ?? 1234

app.use(express.json()) // middleware para mutar req.body
app.use(cors())
app.use((req, res, next) => {
  // revisar si el usuario está logeado
  console.log('midleware')
  next()
})

app.get('/', (req, res) => {
  res.status(200).send('<h1>Inventario</h1>')
})

app.get('/products', (req, res) => {
  const { category } = req.query
  if (category) {
    const filterProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase())
    if (filterProducts) return res.json(filterProducts)

    res.json({})
  }

  res.json(products)
})

app.get('/products/:id', (req, res) => {
  const { id } = req.params
  const product = products.find(product => product.productId === id)
  if (product) return res.json(product)

  res.status(404).json({ message: 'Producto no encontrado' })
})

app.post('/products', (req, res) => {
  const result = validateProduct(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newProduct = {
    id: crypto.randomUUID(), // UUID V4
    ...result.data
  }
  products.push(newProduct)

  res.status(201).json(newProduct)
})

app.patch('/products/:id', (req, res) => {
  const result = validatePartialProduct(req.body)
  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const productIndex = products.findIndex(product => product.productId === id)

  if (productIndex < 0) {
    return req.status(404).json({ message: 'Product not found' })
  }

  const updateProduct = {
    ...products[productIndex],
    ...result.data
  }
  products[productIndex] = updateProduct

  res.json(updateProduct)
})

// .use para todos los metodos (get, post, etc...)
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto: http://localhost:${PORT}`)
})

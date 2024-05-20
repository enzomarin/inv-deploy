import { encrypt, compare } from '../utils/bcryptUtility.js'
import { validateUser, validatePartialUser } from '../schemas/users.js'
import jwt from 'jsonwebtoken'

export class AuthController {
  constructor ({ authModel }) {
    this.authModel = authModel
  }

  login = async (req, res) => {
    const result = validatePartialUser(req.body)
    console.log(result.data)
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const { email, password } = result.data
    const user = await this.authModel.findUserByEmail({ email })
    if (user) {
      const { id, rut, email, password: passwordHash, rol, subscriptionStatus, subscriptionEndDate } = user
      const checkPassword = await compare(password, passwordHash) // <- Return true or false
      if (checkPassword) {
        const userToken = {
          id,
          rut,
          email,
          rol,
          subscriptionStatus,
          subscriptionEndDate
        }
        const token = jwt.sign(userToken, process.env.SECRET, { expiresIn: '1d' })

        // send HTTP-ONLY  COOKIE
        res.cookie('token', token, {
          path: '/',
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 86400), // 1 dia
          sameSite: 'none', // 'none' 'lax'
          secure: true // Cambia a true en producción con HTTPS
        })
        return res.status(200).json({
          rut,
          email,
          token
        })
      }
    }

    return res.status(401).send({ error: 'Invalid email or password' })
  }

  register = async (req, res, next) => {
    try {
      const result = validateUser(req.body)
      if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

      const { rut, email, password, rol, subscriptionStatus, subscriptionEndDate } = result.data
      const userFound = await this.authModel.findUser({ rut })
      if (userFound) {
        return res.status(400).json({ error: 'Rut ya se encuentra registrado' })
      }
      const emailFound = await this.authModel.findUserByEmail({ email })
      if (emailFound) return res.status(400).json({ error: 'Email ya se encuentra registrado' })

      const passwordHash = await encrypt(password)
      const newUser = await this.authModel.register({ rut, email, passwordHash, rol, subscriptionStatus, subscriptionEndDate })
      const { password: _, ...user } = newUser

      if (newUser) return res.status(201).json({ user })
    } catch (error) {
      res.status(409)
      console.log(error)
      next(error)
    }
  }

  logout = async (req, res) => {
    res.cookie('token', '', {
      path: '/',
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'none',
      secure: true
    })

    res.status(200).json({ message: 'Successfully Logged Out' })
  }

  getUser = async (req, res) => {
    /*
    const userFromReq = req.user
    const { email } = req.user
    console.log('user from request: ', userFromReq)
    */
    const user = req.user

    if (user) {
      const { id, rut, email, rol, subscriptionStatus, subscriptionEndDate } = user

      return res.status(200).json({ id, rut, email, rol, subscriptionStatus, subscriptionEndDate })
    } else {
      res.status(400)
      throw new Error('User not found')
    }
  }

  updateUser = async (req, res, next) => {
    try {
      const result = validateUser(req.body)

      if (result.error) {
        const { fieldErrors } = result.error.flatten()
        console.log(JSON.stringify(fieldErrors))
        throw new Error(JSON.stringify(fieldErrors))
      }
      res.send('ok')
    } catch (err) {
      res.status(400)
      next(err)
    }
  }
}

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
    const user = await this.authModel.findUser({ email })
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
          sameSite: 'none',
          secure: true
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
      const passwordHash = await encrypt(password)

      const user = await this.authModel.register({ rut, email, passwordHash, rol, subscriptionStatus, subscriptionEndDate })

      if (user) return res.status(201).json({ message: 'registered user' })
    } catch (error) {
      res.status(409)
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
}

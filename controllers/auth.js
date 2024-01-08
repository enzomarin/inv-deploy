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
      const { id, rut, email, password: passwordHash } = user
      const checkPassword = await compare(password, passwordHash) // <- Return true or false
      console.log(checkPassword)
      if (checkPassword) {
        const userToken = {
          id,
          rut,
          email
        }
        const token = jwt.sign(userToken, process.env.SECRET)

        return res.status(200).json({
          rut,
          email,
          token
        })
      }
    }

    return res.status(401).send({ error: 'Invalid email or password' })
  }

  register = async (req, res) => {
    const result = validateUser(req.body)

    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const { rut, email, password } = result.data
    const passwordHash = await encrypt(password)
    try {
      const user = await this.authModel.register({ rut, email, passwordHash })

      if (user) return res.status(201).json({ message: 'registered user' })
    } catch (error) {
      return res.status(409).json({ message: error.message || 'Already registered user' })
    }
  }
}

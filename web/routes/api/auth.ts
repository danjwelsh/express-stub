import * as express from 'express'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import { Response } from '../../response'
import models from '../../models'
let routes: express.Router

const auth = () => {
  routes = express.Router()
  routes.post('/register', async function (req, res, next) {
    // Get username and password
    const username = req.body.username
    let password = req.body.password

    // abort if either username or password are null
    if (!username || !password) {
      let e = new Error('400')
      return next(e)
    }

    // check for an existing user
    let sUser
    try {
      sUser = await models.User.findOne({username})
    } catch (error) {
      error.message = '500'
      return next(error)
    }

    if (sUser) {
      let e = new Error('403')
      return next(e)
    }

    // Hash user's given password after mixing with a random id
    let iv
    const hash = crypto.createHash('sha256')
    try {
      iv = crypto.randomBytes(16).toString('hex')
      hash.update(`${iv}${password}`)
      password = hash.digest('hex')
    } catch (e) {
      e.message = '500'
      return next(e)
    }

    let user = null;
    try {
      user = await models.User.create({username, password, iv})
    } catch (e) {
      e.message = '500'
      return next(e)
    }

    // create a payload
    const payload = {
      user: user
    }
    // create and sign token against the app secret
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '1 day' // expires in 24 hours
    })

    // let response = responses.success
    let response = new Response(200, 'success', false, { user, token })
    // response.payload = { user, token }
    return res.json(response)
  })

  /**
   * Authenticate a user and return a JWT token
   * @type {Object}
   */
  routes.post('/authenticate', async (req, res, next) => {
    // Get username and password from request
    const username = req.body.username
    let password = req.body.password

    // Look for user with matching username
    let user
    try {
      user = await models.User.findOne({username})
    } catch (e) {
      return next(e)
    }

    if (!user) {
      res.locals.customErrorMessage = 'password or email is incorrect'
      let e = new Error('401')
      return next(e)
    }

    // Hash given password with matching user's stored iv
    const hash = crypto.createHash('sha256')
    try {
      hash.update(`${user.iv}${password}`)
      password = hash.digest('hex')
      // Compare passwords and abort if no match
      if (user.password !== password) {
        res.locals.customErrorMessage = 'password or email is incorrect'
        let e = new Error('401')
        return next(e)
      }
    } catch (e) {
      e.status = 500
      return next(e)
    }

    // create a payload
    let payload = {
      id: user.id,
      username: user.username
    }

    // create and sign token against the app secret
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '1 day' // expires in 24 hours
    })

    let response = new Response(200, 'success', false, { token })
    return res.json(response)
  })
  return routes
}

export default auth

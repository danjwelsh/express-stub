import * as express from 'express'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
// import './../../response'
import { Response } from './../response'
import schemas from './../schemas'
let routes: express.Router

const getRoutes = (app) => {
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
    console.log('checking stored user')
    let sUser
    try {
      // console.log(schemas['User'])
      sUser = await schemas['User'].findOne({username})
      console.log('got stored user')
    } catch (error) {
      console.error(error)
      error.message = '500'
      return next(error)
    }

    console.log('stored user', sUser)

    if (sUser) {
      let e = new Error('400')
      // e.status = 400
      return next(e)
    }

    // Hash user's given password after mixing with a random id
    let iv
    const hash = crypto.createHash('sha256')
    try {
      iv = crypto.randomBytes(16).toString('ascii')
      hash.update(`${iv}${password}`)
      password = hash.digest('hex')
    } catch (e) {
      e.message = '500'
      return next(e)
    }

    // create the user
    let user = new schemas['User']({
      username: username,
      password: password,
      iv: iv
    })
    try {
      user.save()
      console.log(user)
    } catch (e) {
      console.error(e)
      e.message = '500'
      return next(e)
    }

    // create a payload
    const payload = {
      id: user.id,
      username: user.username
    }
    // create and sign token against the app secret
    const token = jwt.sign(payload, app.get('secret'), {
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
      // console.log('getting user')
      user = await app.schemas.User.findOne({username})
      // console.log('user')
    } catch (e) {
      return next(e)
    }

    if (!user) {
      let e = new Error('400')
      return next(e)
    }

    // Hash given password with matching user's stored iv
    const hash = crypto.createHash('sha256')
    try {
      hash.update(`${user.iv}${password}`)
      password = hash.digest(password)
      // Compare passwords and abort if no match
      if (user.password !== password) {
        let e = new Error('403')
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
    const token = jwt.sign(payload, app.get('secret'), {
      expiresIn: '1 day' // expires in 24 hours
    })

    // let response = responses.success
    let response = new Response(200, 'success', false, { token })
    // response.payload = { token }
    return res.json(response)
  })

  return routes
}

module.exports = getRoutes

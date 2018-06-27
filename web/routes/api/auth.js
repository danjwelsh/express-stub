const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const responses = require('./../../response')

module.exports = function (app) {
  let routes = new express.Router()

  routes.post('/register', async function (req, res, next) {
    // Get username and password
    const username = req.body.username
    let password = req.body.password

    // abort if either username or password are null
    if (!username || !password) {
      let e = new Error()
      e.status = 400
      return next(e)
    }

    // check for an existing user
    let sUser = await app.schemas.User.findOne({username})
    if (sUser) {
      let e = new Error()
      e.status = 400
      return next(e)
    }

    // Hash user's given password after mixing with a random id
    let iv
    const hash = crypto.createHash('sha256')
    try {
      iv = crypto.randomBytes(16).toString('ascii')
      hash.update(`${iv}${password}`)
      password = hash.digest(password).toString('ascii')
    } catch (e) {
      e.status = 500
      return next(e)
    }

    // create the user
    let user
    try {
      user = await app.schemas.User.create({username, password, iv})
    } catch (e) {
      e.status = 500
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

    let response = responses.success
    response.payload = { user, token }
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
      user = await app.schemas.User.findOne({username}, (user))
    } catch (e) {
      return next(e)
    }

    if (!user) {
      let e = new Error()
      e.status = 400
      return next(e)
    }

    // Hash given password with matching user's stored iv
    const hash = crypto.createHash('sha256')
    try {
      hash.update(`${user.iv}${password}`)
      password = hash.digest(password).toString('ascii')
      // Compare passwords and abort if no match
      if (user.password !== password) {
        let e = new Error()
        e.message = 'Incorrect password'
        e.status = 403
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

    let response = responses.success
    response.payload = { token }
    return res.json(response)
  })

  return routes
}

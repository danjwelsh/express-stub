const express = require('express')

module.exports = function (app) {
  let routes = new express.Router()

  routes.get('/', async function (req, res, next) {
    return res.send('Hello World')
  })

  return routes
}

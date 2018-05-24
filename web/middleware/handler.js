require('dotenv').config()
const responses = require('./../response')

module.exports = function (app) {
  // Print stack traces when in debugging mode
  if (process.env.DEBUG) {
    app.use(function (err, req, res, next) {
      console.error(err)

      let response = responses.error
      response.code = err.status || 500
      response.messages = err.message
      response.payload = err.stack

      res.status(err.status || 500)

      return res.json(response)
    })
  } else {
    app.use(function (err, req, res, next) {
      let response = responses.error
      response.code = err.status || 500
      response.messages = err.messages

      res.status(err.status || 500)

      return res.json(response)
    })
  }

  return app
}

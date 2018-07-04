import * as express from 'express'
let router

/**
 * Get routes
 * @param  app Express.express
 * @return     Router
 */
function home(): express.Router {
  router = express.Router()
  router.get('/', function (req, res, next) {
    return res.send('Hello World')
  })

  return router
}

export default home

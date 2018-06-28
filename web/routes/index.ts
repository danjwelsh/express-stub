import * as fs from 'fs'
import * as path from 'path'
// import {App} from './../server'

/**
 * Add routes to express
 * @param  __dirname [description]
 * @return           [description]
 */
const addRoutes = (app) => {
  fs.readdirSync(__dirname)
    .filter(function (file) {
      return (file.indexOf('.') !== 0) && (!(file.includes('index')))
    })
    .forEach((file) => {
      let routeName = '/' + file.split('.')[0]
      if (routeName === '/home') {
        routeName = '/'
      }

      let routes = require(path.join(__dirname, file))
      let initRoutes = routes(app)

      app.use(routeName, initRoutes)
    })
  return app
}

export default addRoutes

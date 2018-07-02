// import * as fs from 'fs'
// import * as path from 'path'
import { Express } from 'express'

import home from './home'
import auth from './api/auth'
import user from './api/user'

/**
 * Add routes to express
 * @param  __dirname [description]
 * @return           [description]
 */
const addRoutes = (app: Express) => {
  app.use('/', home())
  app.use('/api/auth', auth())
  console.log(user())
  app.use('/api/user', user())
  return app
}

export default addRoutes

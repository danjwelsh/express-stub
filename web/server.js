require('dotenv').config({path: './.env'})
// *****************************************************************************
// Routes
// *****************************************************************************
const routes = require('./routes')
const mongoose = require('mongoose')
const schemas = require('./schemas')
// *****************************************************************************
// Middleware
// *****************************************************************************
const handlerMiddleware = require('./middleware/handler')

// *****************************************************************************
// Setup
// *****************************************************************************
module.exports = {
  getServerInstance: () => {
    let app = require('./config')
    return app
  },
  initDatabase: (app) => {
    return new Promise(function (resolve, reject) {
      mongoose.connect(process.env.MONGO_URI)
      mongoose.connection.once('open', () => {
        app.schemas = schemas
        resolve(app)
      })
      mongoose.connection.once('error', reject)
    })
  },

  addErrorHandler: (app) => {
    app = handlerMiddleware(app)
    return app
  },

  addHeaders: (app) => {
    return app
  },

  addRoutes: (app) => {
    app = routes(app)
    return app
  }
}

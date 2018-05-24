const server = require('./web/server')

async function main () {
  try {
    let app = server.getServerInstance()
    app = await server.initDatabase(app)
    app = server.addRoutes(app)
    app = server.addErrorHandler(app)

    app.enable('trust proxy')

    app.listen(8888)
    console.log('Listening on port: ' + 8888)
  } catch (e) {
    console.error(e)
  }
}

main()

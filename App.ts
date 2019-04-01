import { App } from "./web/Server";

// Set the port, default to 3000
const port = process.env.PORT || 3000
const app = new App()

// Start listening for requests
app.express.listen(port, (err: Error) => {
  if (err) {
    console.error(err)
  } else {
    console.log(`server is listening on ${port}`)
  }
})

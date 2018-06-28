// import responses from './../response'
import * as express from "express"
import {Response} from './../response'

const handleResponse: express.ErrorRequestHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const code = parseInt(err.message)
  let response = getError(code)
  response.payload = null

  res.status(code)
  res.json(response)
  return next()
}

const handleResponseDebug: express.ErrorRequestHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const code = parseInt(err.message)
  let response = getError(code)
  response.payload = err.stack

  console.log(err.stack)

  res.status(code)
  res.json(response)
  return next()
}

/**
 * [getError description]
 * @param  code [description]
 * @return      [description]
 */
function getError(code: number): Response {
  let message
  switch (code) {
    case 401:
      message = 'unauthorised'
      break
    case 403:
      message = 'forbidden'
      break
    case 404:
      message = 'not found'
      break
    case 500:
      message = 'server error'
      break
    default:
      message = 'server error'
      break
  }

  return new Response(code, message, true, null)
}

export {
  handleResponseDebug,
  handleResponse
}

import * as express from "express"
import { Response } from './../response'

const handleResponse: express.ErrorRequestHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const code: number = parseInt(err.message)

  let response = getError(code)
  if (res.locals.customErrorMessage) {
    response.message = res.locals.customErrorMessage
  }

  res.status(code)
  return res.json(response)
}

const handleResponseDebug: express.ErrorRequestHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const code: number = parseInt(err.message)

  let response = getError(code)
  if (res.locals.customErrorMessage) {
    response.message = res.locals.customErrorMessage
  }
  response.payload = err.stack

  if (process.env.TEST !== 'true') {
    console.error(err.stack)
  }

  res.status(code)
  return res.json(response)
}

/**
 * Get message from error code
 * @param  code number
 * @return      Response
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

// Export functions
export {
  handleResponseDebug,
  handleResponse
}

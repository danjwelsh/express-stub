import * as express from "express"
import { Reply } from '../Reply'

/**
 * Handle an error and give an appropriate response
 * @param {Error} err
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Response}
 */
const handleResponse: express.ErrorRequestHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const code: number = parseInt(err.message)
  // Get error message from code
  let reply: Reply = getError(code)

  // Overwrite with custom error if given in local headers
  if (res.locals.customErrorMessage) {
    reply.message = res.locals.customErrorMessage
  }

  // Give full stacktrace if in debug mode
  if (process.env.DEBUG === 'true') {
    reply.payload = err.stack
  }

  // Do not print full stack if unit testing
  if (process.env.TEST !== 'true') {
    console.error(err.stack)
  }

  // Set status code of error message
  res.status(code)
  return res.json(reply)
}

/**
 * Get an error message from a code
 * @param {number} code
 * @returns {Reply}
 */
function getError(code: number): Reply {
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

  return new Reply(code, message, true, null)
}

// Export functions
export {
  handleResponse
}

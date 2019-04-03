import * as express from "express";
import { HttpError } from "http-errors";
import { Reply } from "../Reply";

/**
 * Handle an error and give an appropriate response
 * @param {Error} err
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Response}
 */
const handleResponse: express.ErrorRequestHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const e: HttpError = err as HttpError;
  // Get error message from code
  const reply: Reply = new Reply(e.status, e.message, true, null);

  // Overwrite with custom error if given in local headers
  if (res.locals.customErrorMessage) {
    reply.message = res.locals.customErrorMessage;
  }

  // Give full stacktrace if in debug mode
  if (process.env.DEBUG === "true") {
    reply.payload = e.stack;
  }

  // Do not print full stack if unit testing
  if (process.env.TEST !== "true") {
    console.error(e);
  }

  // Set status code of error message
  res.status(e.status);
  return res.json(reply);
};

// Export functions
export { handleResponse };

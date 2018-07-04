import * as jwt from 'jsonwebtoken'
import * as express from 'express'
import { IUser } from '../schemas/user'

/**
 * Authenticate a user from their JWT token and add their ID to response local header
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
export default function (req: express.Request, res: express.Response, next: express.NextFunction) {
  // Pull token from headers/body
  const token : string = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token

  // verify token if exists, return error if invalid or missing
  if (token) {
    jwt.verify(token, process.env.SECRET, (err: Error, user: IUser) => {
      if (err) {
        res.locals.customErrorMessage = 'invalid token'
        res.locals.error = 401
        next()
      } else {
        res.locals.user = user
        return next()
      }
    })
  } else {
    res.locals.customErrorMessage = 'token not provided'
    res.locals.error = 401
    next()
  }
}

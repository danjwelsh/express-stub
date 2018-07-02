import { verify } from 'jsonwebtoken'
import { Response } from '../response'
import * as express from 'express'

const checkToken = function (req: express.Request, res: express.Response, next: express.NextFunction) {
  const token : string = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token

  if (token) {
    verify(token, process.env.SECRET, (err: Error, user: any) => {
      if (err) {
        return res.json(new Response(403, 'token error', true, {}))
      } else {
        res.locals.user = user
        return next()
      }
    })
  } else {
    return res.json(new Response(403, 'no token provided', true, {}))
  }
}

export {
  checkToken
}

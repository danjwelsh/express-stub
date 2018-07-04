import models from '../../models'
import {IUser} from '../../schemas/user'
import { Reply } from '../../reply'

import checkToken from '../../middleware/authenticate'
import { Request, Response, NextFunction, Router } from "express"

let router : Router

/**
 * Returns router for user
 * @returns {e.Router}
 */
const user = () => {
  router = Router()

  // User must be authorised for routes below
  router.use(checkToken)

  /**
   * Return the user's profile
   */
  router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
    // Check if there is an error higher up the middleware chain and skip endpoint
    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`))
    }

    // Get user from id collected from 'checkToken middleware'
    const userId: string = res.locals.user.id
    let user: IUser
    try {
      user = await models.User.findOne({ _id: userId })
    } catch (e) {
      e.message = '500'
      return next(e)
    }
    return res.json(new Reply(200, 'success', false, { user }))
  })

  /**
   * Delete the user from the database
   */
  router.delete('/destroy', async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.error) {
      return next(new Error(`${res.locals.error}`))
    }
    const userId: string = res.locals.user.id
    try {
      await models.User.deleteOne({ _id: userId })
    } catch (e) {
      return next(e)
    }

    return res.json(new Reply(200, 'success', false, {}))
  })

  return router
}
export default user

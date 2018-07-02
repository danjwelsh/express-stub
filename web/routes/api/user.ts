import * as express from 'express'
import models from '../../models'
import {IUser} from '../../schemas/user'
import { Response } from '../../response'

import * as checkToken from '../../middleware/authenticate'

let router : express.Router

const user = () => {
  router = express.Router()

  router.use(checkToken.checkToken)

  router.get('/me', async function (req, res, next) {
    const userId: string = res.locals.user.id
    let user: IUser
    try {
      user = await models.User.findOne({_id: userId})
    } catch (e) {
      return next(e)
    }
    return res.json(new Response(200, 'success', false, { user }))
  })

  return router
}

export default user

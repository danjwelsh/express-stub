import mongoose = require('mongoose')
import { IUser, UserSchema } from './schemas/user'

/**
 * Create new object for each model using interface of model and schema
 */
export default {
  User: mongoose.model<IUser>(
      'User', UserSchema
    )
}

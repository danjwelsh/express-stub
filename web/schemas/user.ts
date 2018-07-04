import { Schema, Document } from 'mongoose'

const schemaOptions = {
  timestamps: true
}

/**
 * User interface extending the Mongoose.Document
 */
export interface IUser extends Document {
  username: string
  password: string
  iv: string
  createdAt: string
  updatedAt: string
}

/**
 * Model a user schema in the database
 * @type {module:mongoose.Schema}
 */
export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  }
}, schemaOptions)

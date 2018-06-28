import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

export const userModel = new Schema ({
  username: {
    type: 'String',
    unique: true,
    required: true,
    dropDups: true
  },
  password: {
    type: 'String',
    required: true
  },
  iv: {
    type: 'String'
  }
})

// export userModel

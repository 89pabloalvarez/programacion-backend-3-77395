import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  role: {
    type: [String],
    default: [],
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
})

UserSchema.plugin(mongoosePaginate)

export const UserModel = model('users', UserSchema)
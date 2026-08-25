import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { DocumentMetadataSchema } from './documentMetadata.js'

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
  },
  documents: {
    type: [DocumentMetadataSchema],
    default: []
  }
})

UserSchema.plugin(mongoosePaginate)

export const UserModel = model('users', UserSchema)
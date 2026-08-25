import { Schema } from 'mongoose'

export const DocumentMetadataSchema = new Schema({
  originalName: {
    type: String,
    required: true
  },
  storedName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  documentType: {
    type: String,
    default: 'other'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true })
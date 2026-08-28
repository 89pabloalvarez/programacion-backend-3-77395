import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import { DocumentMetadataSchema } from './documentMetadata.js'

const DeliverySchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: 'carts',
    required: true
  },
  deliveryMan: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  receipts: {
    type: [DocumentMetadataSchema],
    default: []
  }
})

DeliverySchema.plugin(mongoosePaginate)

export const DeliveryModel = model('deliveries', DeliverySchema)
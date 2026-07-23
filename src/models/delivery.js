import { Schema, model } from 'mongoose'

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
  }
})

export const DeliveryModel = model('deliveries', DeliverySchema)
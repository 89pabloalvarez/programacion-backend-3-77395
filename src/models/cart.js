import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const CartSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
})

// Populate automático en todas las queries de lectura
CartSchema.pre('find', function () {
  this.populate({
    path: 'products.product',
    select: 'title price'
  })
})

CartSchema.pre('findOne', function () {
  this.populate({
    path: 'products.product',
    select: 'title price'
  })
})

CartSchema.pre('findOneAndUpdate', function () {
  this.populate({
    path: 'products.product',
    select: 'title price'
  })
})

CartSchema.plugin(mongoosePaginate)

export const CartModel = model('carts', CartSchema)
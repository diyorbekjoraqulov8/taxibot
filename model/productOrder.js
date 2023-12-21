const { Schema, model } = require('mongoose')

const ProductOrder = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  productType:String,
  productName:String,
  productPrice:Number,
  productCount:Number,
  origin:Object,
  createdAt: Date,
  status: {
    type: Number,
    default: 0
    /* 
    0 - faol emas
    1 - buyurtma berilda
    2 - tasdiqlandi
    3 - mahsulot yetkazib berildi
    */
  }
})

module.exports = model('ProductOrder', ProductOrder)
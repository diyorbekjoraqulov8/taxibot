const { Schema, model } = require('mongoose')

const TaxiOrder = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  driver: {
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  origin:Object,
  destination:Object,
  distance:Object,
  duration:Object,
  createdAt: Date,
  status: {
    type: Number,
    default: 0
    /* 
    0 - faol emas
    1 - haydovchi qidirilmoqda
    2 - haydovchi topildi
    3 - haydovchi mijoz oldiga yetib bordi
    4 - mijoz manzilga yetkazildi
    */
  }
})

module.exports = model('TaxiOrder', TaxiOrder)
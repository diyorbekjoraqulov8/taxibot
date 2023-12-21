const { Schema, model } = require('mongoose')

const User = new Schema({
  full_name: String,
  chatId: Number,
  phone: String,
  createdAt: Date,
  action:String,
  activity:{
    type:String,
    default:'client'
  },
  status: {
    type: Number,
    default: 0
    /* Driver
    1 - is registered
    2 - is checked
    3 - is working */
  },
  carInfo:Object,
  admin:{
    type:Boolean,
    default:false
  }
})

module.exports = model('User', User)
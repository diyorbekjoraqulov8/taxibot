const User = require("../../model/user")
const TaxiOrder = require("../../model/taxiOrder")
const { bot } = require("../bot")
const { findPlaces } = require("../common/findPlaces")
const { shareLocation } = require("../keybord/keyboards")

const textFrom = "Joylashuvingizni yuboring👇"

const getClientOrder = async (chatId,user,type,location) => {
  if (type === 'init') {
    await User.findByIdAndUpdate(user._id,{
      ...user,
      action:'taxiOrderClient'
    },{new:true})
    await cancel_clientOrder(user._id, 'all')

    bot.sendMessage(chatId, textFrom,{
      reply_markup: {
        keyboard: shareLocation,
        one_time_keyboard:true,
        resize_keyboard:true,
      }
    })
  } else if(type === 'from') {
    if (location) {
      try {
        let address;
        await findPlaces(location.latitude, location.longitude)
        .then(res => address = res)
        console.log("address: ", address);
        const new_taxi_order = new TaxiOrder({
          user:user._id,
          createdAt: new Date(),
          origin: address
        })
        await new_taxi_order.save()

        bot.sendMessage(chatId, `Kiritgan manzilingiz haqiqatdan ham ${address?.text}mi ?`,{
          reply_markup: {
            inline_keyboard:[
              [
                {text:"Ha",callback_data:'taxiOrderClient-success'},
                {text:"Yo'q",callback_data:'taxiOrderClient-cancel-0'}
              ]
            ],
            remove_keyboard:true
          }
        })
      } catch (error) {
        console.log(error);
        await getClientOrder(chatId,user,'from',location)
      }
      
    }
  }
}

const cancel_clientOrder = async (userId,status) => {
  if (status === 'all') {
    await TaxiOrder.deleteMany({user:userId, status:0})
    await TaxiOrder.deleteMany({user:userId, status:1})
    
  } else {
    await TaxiOrder.deleteMany({user:userId, status})
  }
}

module.exports = {
  getClientOrder,
  cancel_clientOrder
}
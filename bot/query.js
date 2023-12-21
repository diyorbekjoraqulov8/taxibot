const { bot } = require('./bot')
const User = require('../model/user')
const { registerDriver, registerUser } = require('./common/auth/register')
const { menu } = require('./replyText/menu')
const { cancel_clientOrder } = require('./taxi/clientOrder')
const TaxiOrder = require('../model/taxiOrder')
const { findDriver } = require('./taxi/findDriver')
const { sendTaxiOrderAcceptIK } = require('./keybord/inlineKeyboard')

bot.on('callback_query', async query => {
  const {data} = query
  const chatId = query.from.id

  if (data === 'menu') {
    const user = await User.findOne({chatId})
    menu(chatId,user)
  } else if (data.includes('register_car_')) { /* =-=-= For taxi =-=-= */
    let carInfo = data.split('_')
    let msgId = query.message.message_id

    let obj = {
      message_id: msgId,
      value:carInfo[2]
    }
    await registerDriver(chatId,obj)
  } else if (data.includes('taxiOrderClient-')) { /* =-=-= For taxi =-=-= */
    const type = data.split('-')
    if (type[1] === 'success') {
      const user = await User.findOne({chatId})
      let taxi_order = await TaxiOrder.findOne({
        user: user._id,
        status:0
      })
      taxi_order.status = 1
      taxi_order.save()
      let msgId = query.message.message_id;
      let searchDriver = bot.sendMessage(chatId,"Haydovchi qidirilmoqda...",{
        reply_markup:{
          inline_keyboard:[
            [
              {text:"Bekor qilish",callback_data:'taxiOrderClient-cancel-1'}
            ]
          ]
        }
      })
      bot.editMessageReplyMarkup({
        reply_markup:  {
          inline_keyboard: []
        }
      }, {
        chat_id: chatId, 
        message_id: msgId
      })

      await findDriver(chatId,taxi_order)

      setTimeout(() => {
        searchDriver
        .then(res => {
          let msgId = res?._rejectionHandler0?.message_id
          bot.deleteMessage(chatId,msgId)
        })
      }, 50000);
      console.log("searchDriver: ", searchDriver);
    } else if (type[1] === 'cancel') {
      let msgId = query.message.message_id;
      const user = await User.findOne({chatId})
      await menu(chatId,user)
      await cancel_clientOrder(user._id,type[2])
      
      bot.editMessageReplyMarkup({
        reply_markup:  {
          inline_keyboard: []
        }
      }, {
        chat_id: chatId, 
        message_id: msgId
      })
    }
  } else if (data.includes('taxiOrderDriver-')) { /* =-=-= For taxi =-=-= */
    let msgId = query.message.message_id
    let queryInfo = data.split('-')
    if (queryInfo[1] === 'cancel') {
      await bot.deleteMessage(chatId,msgId)
    } else if (queryInfo[1] === 'success') {
      let user = await User.findOne({chatId})
      let carInfo = user?.carInfo
      let orderId = queryInfo[2]
      let taxi_order = await TaxiOrder.findOne({
        _id: orderId,
        status:1
      }).populate('user')

      if (taxi_order) {
        taxi_order.status = 2
        taxi_order.save()
        bot.sendMessage(taxi_order.user?.chatId, `Haydovchi topildi.\n\nIsm: ${user.full_name}\nTel: ${user.phone}\nMashena: ${carInfo?.carColor} ${carInfo?.carModel}\nMashena raqami: ${carInfo?.carNumber.toUpperCase()}`)

        bot.editMessageReplyMarkup({
          reply_markup:  {
            inline_keyboard: sendTaxiOrderAcceptIK
          }
        }, {
          chat_id: chatId, 
          message_id: msgId
        })
      } else {
        bot.sendMessage(chatId, "❌Haydovchi topilgan yoki Buyurtma bekor qilingan\n\nTezroq harakat qilish kerak edi 🤷‍♂️")
        await bot.deleteMessage(chatId,msgId)
      }
    }
  }
})
const { bot } = require('../bot')
const User = require('../../model/user')

async function findDriver(chatId,taxi_order) {
  let adress = taxi_order?.origin
  let location = adress?.latLng?.split(', ')
  let user = await User.findOne({chatId})
  let drivers = await User.find({activity:'driver',status:3})
  console.log(drivers);
  // await Promise.all()
  drivers.forEach(async driver => {
    // await bot.sendLocation(driver.chatId, location[0], location[1]);
    await bot.sendMessage(driver.chatId,`🚕 Yangi buyurtma 🔉\n🧍‍♂️ Buyurtmachi: ${user.full_name}\n\n📞 Telefon raqam: ${user.phone}\n\n🗺 Manzil: ${adress.text}`,{
      reply_markup: {
        inline_keyboard: [
          [
            {
              text:"Bekor qilish",
              callback_data:`taxiOrderDriver-cancel-${taxi_order._id}`
            },
            {
              text:"Qabul qilish",
              callback_data:`taxiOrderDriver-success-${taxi_order._id}`
            },
          ],
          [
            {
              text:"Lakatsiyani olish",
              url: `https://maps.google.com/?q=${location[0]},${location[1]}`
            },
            
          ]
        ]
      }
    })
  });
}

module.exports = {
  findDriver
}
const User = require('../model/user')
const { bot } = require('./bot')
const { clear_users, registerUser, registerDriver, clear_driver_info } = require('./common/auth/register')
const { menuClient, menuDriver } = require('./keybord/keyboards')
const { getClientOrder } = require('./taxi/clientOrder')
const { welcome } = require('./replyText/welcome')
const { menu } = require('./replyText/menu')
const TaxiOrder = require('../model/taxiOrder')
const { getDriverOrder } = require('./taxi/driverOrder')

bot.on('message', async msg => {
  const chatId = msg.from.id
  const text = msg.text?.toLocaleLowerCase()
  const user = await User.findOne({chatId})
  const location = msg.location

  /* If start */
  if (text === '/start') {
    if (!user?.status) {
      await clear_users(chatId)
    }
    await welcome(msg,user)
    // hello()
  } else if (user?.action.includes('register-')) {
    let phone = msg.contact?.phone_number
    let type = user?.action.split('-')[1]
    if (type === 'client') {
      if (phone) {
        await registerUser(chatId,phone)
      } else {
        await registerUser(chatId,text)
      }
    } else if (type === 'driver') {
      await registerDriver(chatId,text)
    }
  } else if (user?.status) {
    if (text === "🚗 haydovchi bo'lish" || text === "haydovchi bo'lish") {
      if (user.activity !== 'driver') {
        if (user.carInfo) {
          await clear_driver_info(chatId)
        }
        user.action = 'register-driver'
        user.save()
        bot.sendMessage(chatId,"Mashena raqamini yozing:\nM:00A123NN",{
          reply_markup:{
            remove_keyboard:true
          }
        })
      }
    } else if (text === '🚗 ishni boshlash' || text === 'ishni boshlash') {
      if (user.activity === 'driver' && user.status === 2) {
        await getDriverOrder(chatId, 'start')
      } else {
        bot.sendMessage(chatId, "❌Siz ish boshlay olmaysiz!")
      }
    } else if (text === '❌ 🚗 ishni tugatish' || text === 'ishni tugatish') {
      if (user.activity === 'driver' && user.status === 3) {
        await getDriverOrder(chatId, 'end')
      } else {
        bot.sendMessage(chatId, "❌Siz ishni tugata olmaysiz!")
      }
    } else if (text == '🔝 bosh sahifa') {
      menu(chatId,user)
    } else if (text === 'malumotlarim' && user.action === 'menu') {
      aboutMe(chatId,user)
    } else if (text == '🚕 taksi chaqirish' || text == 'taksi chaqirish') {
      await getClientOrder(chatId,user,'init')
    } else if (text == '📦 mahsulot buyurtma berish' || text == 'mahsulot buyurtma berish') {
      
    } else if (location) {
      if (user.action = 'taxiOrderClient') {
        getClientOrder(chatId,user,'from',location)
      }
    } else {
      otherSendMessage(chatId,user)
    }
  } else {
    otherSendMessage(chatId,user)
  }
})

async function otherSendMessage(chatId,user) {
  if (user?.status) {
    user.action = 'menu'
    user.save()

    bot.sendMessage(chatId,"Bu buyruq mavjud emas!\nMenyudan tanlang",{
      reply_markup:{
        keyboard: user?.carInfo ? menuDriver : menuClient,
        resize_keyboard:true
      }
    })
  } else {
    bot.sendMessage(chatId,"Bu buyruq mavjud emas!", {
      reply_markup: {
        remove_keyboard:true
      }
    })
  }
  
}

function aboutMe(chatId,user) {
  bot.sendMessage(chatId,`👨‍💻 Ism Familya: ${user.full_name}\n➡️ Status: ${user.carInfo ? 'Haydovchi' : 'Mijoz'}\n📞 Phone: ${user.phone}`,{
    reply_markup:{
      inline_keyboard: [
        [
          {text:'Tahrirlash',callback_data:'edit'},
          {text:"O'chirish",callback_data:'delete'}
        ]
      ]
    }
  })
}

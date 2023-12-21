const { bot } = require('../../bot')
const User = require('../../../model/user')
const { phoneShare, menuClient, menuDriver } = require('../../keybord/keyboards')
const { carModels, carColors } = require('../../keybord/inlineKeyboard')

const successMessage = "Muvafaqiyatli ro'yxatdan o'tdingiz.\nMenyudan tanlang";

let carColorKeyboard = {
  reply_markup: {
    inline_keyboard: carColors
  }
};
let carModelKeyboard = {
  reply_markup: {
    keyboard: menuDriver,
    resize_keyboard:true
  }
};

const registerDriver = async (chatId,text) => {
  const user = await User.findOne({chatId})

  if (!user.carInfo) {
    user.carInfo = {
      carNumber: text
    }
    await user.save();
    bot.sendMessage(chatId,"Mashena modelini tanlang",{
      reply_markup:{
        inline_keyboard:carModels
      }
    })
  } else if (!user.carInfo.carModel) {
    console.log("text: ", text);
    if (text?.value) {
      user.carInfo = {
        ...user.carInfo,
        carModel: text.value
      }
      await user.save();
      bot.editMessageText("Mashena rangini tanlang", {
        chat_id:chatId,
        message_id:text.message_id,
        reply_markup:carColorKeyboard.reply_markup
      })
    } else {
      bot.sendMessage(chatId,"Mashena modelini tanlang",{
        reply_markup:{
          inline_keyboard:carModels
        }
      })
    }
  } else if (!user.carInfo.carColor) {
    console.log("text: ", text);
    if (text?.value) {
      user.carInfo = {
        ...user.carInfo,
        carColor: text.value
      }
      user.action = "menu"
      user.activity = "driver"
      await user.save();
      await bot.deleteMessage(chatId,text.message_id)
      bot.sendMessage(chatId,successMessage,{
        reply_markup:{
          keyboard: menuDriver,
          resize_keyboard:true
        }
      })
      bot.sendMessage(chatId,"Menedjerimiz siz bilan tez oraqa aloqaga chiqadi...")

      let admin = await User.findOne({admin:true})
      
      if (admin) {
        console.log(admin);
        bot.sendMessage(admin.chatId, `🌟 *Yangi Haydovchi* 🌟\n\n👤 *Ism Familya:* ${user.full_name}\n📱 *Telefon raqam:* ${user.phone}\n\n🟡 *Mashena rangi:* ${user.carInfo.carColor}\n🚕 *Mashena madeli:* ${user.carInfo.carModel}\n🚕 *Mashena raqami:* ${user.carInfo.carNumber}`, {
          parse_mode: 'Markdown'
        })
      }
    } else {
      bot.sendMessage(chatId,"Mashena rangini tanlang",{
        reply_markup:{
          inline_keyboard:carColorKeyboard.reply_markup.inline_keyboard
        }
      })
    }
  }
}
const registerUser = async (chatId,text) => {
  const user = await User.findOne({chatId})

  if (!user) {
    const newUser = new User({
      chatId: chatId,
      action: `register-client`
    });
    await newUser.save();
    bot.sendMessage(chatId, "Ism Familyangizni kiriting!\nMisol: Diyorbek Jo'raqulov ", {
      reply_markup:{
        remove_keyboard:true,
      }
    })
  } else if(!user.full_name) {
    user.full_name = text
    await user.save();
    bot.sendMessage(chatId, `Telefon raqamingizni kiriting!`,{
      reply_markup:{
        keyboard:phoneShare,
        resize_keyboard:true,
      }
    })
  } else if (!user.phone) {
    user.phone = text
    user.status = 1
    user.action = "menu"
    await user.save();
    bot.sendMessage(chatId,successMessage,{
      reply_markup:{
        keyboard: menuClient,
        resize_keyboard:true
      }
    })
  }
}

const clear_users = async (chatId) => {
  await User.deleteMany({chatId, status:0})
}

const clear_driver_info = async (chatId) => {
  let driver = await User.findOne({chatId})
  driver.carInfo = null
  driver.save()
}

module.exports = {
  registerDriver,
  registerUser,
  clear_users,
  clear_driver_info
}
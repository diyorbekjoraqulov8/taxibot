const { bot } = require('../bot')
const User = require('../../model/user')
const { menuDriver, menuClient } = require('../keybord/keyboards')

const menu = async (chatId,user) => {
  user.action = 'menu'
  await user.save()

  bot.sendMessage(chatId,"Munyudan tanlang",{
    reply_markup:{
      keyboard: user.activity === 'driver' ? menuDriver : menuClient,
      resize_keyboard:true
    }
  })
}

module.exports = {
  menu
}
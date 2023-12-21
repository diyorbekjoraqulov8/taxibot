const User = require("../../model/user")
const { bot } = require("../bot")
const { menuDriverWork, menuDriver } = require("../keybord/keyboards")

const startText = "🚖 Ish boshlandi... Tez orada mijoz topiladi 😉"
const endText = "🚖 Ish yakunlandi\n\nAgarda yana ishlamoqchi bo'lsangiz ⬇️pastdagi _🚗Ishni boshlash_ tugmasini bosing 😉"

const getDriverOrder = async (chatId, type) => {
  const user = await User.findOne({chatId})
  if (type === 'start') {
    user.status = 3
  } else if(type === 'end') {
    user.status = 2
  }
  user.save()
  bot.sendMessage(chatId,type === 'start' ? startText : endText, {
    reply_markup: {
      keyboard: type === 'start' ? menuDriverWork : menuDriver,
      resize_keyboard: true
    },
    parse_mode: 'Markdown'
  })
}

module.exports = {
  getDriverOrder
}
const { registerUser } = require('../common/auth/register')
const { menu } = require('./menu')

const welcome = async (msg,user) => {
  const chatId = msg.from.id
  
  if (!user?.status) {
    await registerUser(chatId)
  } else {
    await menu(chatId,user)
  }
}

module.exports = {
  welcome
}
const axios = require('axios');

async function notificarTelegram(mensagem) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: chatId,
    text: mensagem
  });
}

module.exports = { notificarTelegram };

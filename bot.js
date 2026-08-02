const axios = require('axios');

const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';
const API_URL = 'https://api.max.ru/messages.send';

async function sendMessage(peerId, text) {
  await axios.post(API_URL, {
    peer_id: peerId,
    text: text
  }, {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` }
  });
}

async function startLongPoll() {
  console.log('⏳ Бот запущен в режиме Long Poll. Жду /start...');
  
  while (true) {
    try {
      const response = await axios.get('https://api.max.ru/longpoll', {
        headers: { Authorization: `Bearer ${BOT_TOKEN}` }
      });

      if (response.data && response.data.events) {
        for (const event of response.data.events) {
          if (event.type === 'message_new') {
            const text = event.message?.text?.toLowerCase();
            const peerId = event.message?.peer_id;

            if (text === '/start') {
              await sendMessage(peerId, '✅ Бот работает! Команда /start получена.');
              console.log('✅ Ответил на /start');
            }
          }
        }
      }
    } catch (err) {
      console.error('❌ Ошибка Long Poll:', err.message);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

startLongPoll();

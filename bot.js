const axios = require('axios');

// Твои данные
const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';
const API_URL = 'https://api.max.ru/messages.send';

// Функция отправки сообщения
async function sendMessage(peerId, text) {
  await axios.post(API_URL, {
    peer_id: peerId,
    text: text
  }, {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` }
  });
}

// Long Poll: слушаем входящие сообщения
async function startLongPoll() {
  console.log('⏳ Бот запущен, слушаю команду /start...');
  
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
              await sendMessage(peerId, 'Привет! Я твой тестовый бот. Команда /start работает!');
              console.log('✅ Ответил на команду /start');
            }
          }
        }
      }
    } catch (err) {
      console.error('❌ Ошибка Long Poll:', err.message);
    }
    
    // Небольшая задержка
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Запускаем бота
startLongPoll();

const axios = require('axios');
const https = require('https');

const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';

// Создаём агент с отключённой проверкой SSL (обходим ошибку сертификата)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function sendMessage(peerId, text) {
  try {
    await axios.post('https://api.max.ru/messages.send', {
      peer_id: peerId,
      text: text
    }, {
      headers: { Authorization: `Bearer ${BOT_TOKEN}` },
      httpsAgent
    });
    console.log('✅ Сообщение отправлено');
  } catch (e) {
    console.error('❌ Ошибка отправки:', e.message);
  }
}

async function startLongPoll() {
  console.log('🤖 Бот запущен. Жду команду /start...');
  
  while (true) {
    try {
      const response = await axios.get('https://api.max.ru/longpoll', {
        headers: { Authorization: `Bearer ${BOT_TOKEN}` },
        httpsAgent,
        timeout: 5000
      });

      if (response.data && response.data.events) {
        for (const event of response.data.events) {
          if (event.type === 'message_new') {
            const text = event.message?.text?.toLowerCase();
            const peerId = event.message?.peer_id;

            if (text === '/start') {
              await sendMessage(peerId, '✅ Бот работает! Команда /start получена.');
            }
          }
        }
      }
    } catch (err) {
      // Игнорируем 404 (нормально для Long Poll)
      if (err.response?.status !== 404) {
        console.error('⚠️ Ошибка Long Poll:', err.message);
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}

startLongPoll();

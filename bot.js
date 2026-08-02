const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.MAX_BOT_TOKEN;

// Запрос к API MAX
function callAPI(method, data) {
  const payload = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'platform-api2.max.ru',
      path: '/' + method,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': BOT_TOKEN,
        'Content-Length': payload.length
      }
    }, (res) => {
      let raw = '';
      res.on('data', (chunk) => raw += chunk);
      res.on('end', () => {
        resolve(raw);
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Таймер для проверки входящих сообщений
function checkMessages() {
  callAPI('updates', {})
    .then((data) => {
      try {
        const events = JSON.parse(data);
        if (events && events.length) {
          for (const ev of events) {
            // Слушаем только личные сообщения (не канал)
            if (ev.type === 'message_created' && ev.message?.peer_type === 'user') {
              const text = ev.message?.text?.toLowerCase();
              const peerId = ev.message?.sender?.user_id;
              if (text === '/start' && peerId) {
                callAPI('messages.send', {
                  peer_id: peerId,
                  text: '✅ Бот работает в ЛС! Команда /start получена.',
                });
                console.log('✅ Ответил на /start в ЛС');
              }
            }
          }
        }
      } catch (e) {
        console.error('Ошибка парсинга:', e.message);
      }
    })
    .catch((err) => {
      if (!err.message.includes('ECONNREFUSED')) {
        console.error('⚠️ Ошибка запроса:', err.message);
      }
    });
}

// Проверяем каждые 3 секунды
setInterval(checkMessages, 3000);
console.log('🤖 Бот запущен (ЛС). Жду /start в личных сообщениях...');

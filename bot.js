const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.MAX_BOT_TOKEN;
const CHANNEL_ID = '77483436379527';

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

// Таймер для проверки входящих сообщений (Long Poll)
function checkMessages() {
  callAPI('updates', {}) // 'updates' — метод для получения новых событий
    .then((data) => {
      try {
        const events = JSON.parse(data);
        if (events && events.length) {
          for (const ev of events) {
            if (ev.type === 'message_created') {
              const text = ev.message?.text?.toLowerCase();
              const peerId = ev.message?.recipient?.chat_id || ev.message?.sender?.user_id;
              if (text === '/start' && peerId) {
                callAPI('messages.send', {
                  peer_id: peerId,
                  text: '✅ Бот работает! Это максимум.',
                });
              }
            }
          }
        }
      } catch (e) {}
    })
    .catch(() => {});
}

// Держим процесс живым и проверяем каждые 3 секунды
setInterval(checkMessages, 3000);
console.log('🤖 Бот работает в режиме API (без Callback)');

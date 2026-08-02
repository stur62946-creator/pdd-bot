const https = require('https');

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.MAX_BOT_TOKEN;

// Создаём HTTPS-агент с игнорированием сертификатов
const agent = new https.Agent({
  rejectUnauthorized: false  // Отключаем проверку сертификата
});

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
      },
      agent: agent  // Используем агент с отключённой проверкой
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

// Проверка входящих сообщений
function checkMessages() {
  callAPI('updates', {})
    .then((data) => {
      try {
        const events = JSON.parse(data);
        if (events && events.length) {
          for (const ev of events) {
            if (ev.type === 'message_created') {
              const text = ev.message?.text?.toLowerCase();
              const peerId = ev.message?.sender?.user_id || ev.message?.recipient?.chat_id;
              if (text === '/start' && peerId) {
                callAPI('messages.send', {
                  peer_id: peerId,
                  text: '✅ Бот работает! Игнорируем сертификат.',
                });
                console.log('✅ Ответил на /start');
              }
            }
          }
        }
      } catch (e) {}
    })
    .catch(() => {});
}

setInterval(checkMessages, 3000);
console.log('🤖 Бот запущен (без проверки сертификата). Жду /start...');

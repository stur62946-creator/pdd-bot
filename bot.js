const http = require('http');

const BOT_TOKEN = process.env.MAX_BOT_TOKEN;
const CHANNEL_ID = '77483436379527'; // ID твоего канала

// Сервер для Callback API
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const event = JSON.parse(body);
      
      // Если это новое сообщение и текст равен /start
      if (event.type === 'message_new' && event.message?.text?.toLowerCase() === '/start') {
        const peerId = event.message?.peer_id;
        
        // Отправляем сообщение через API Max
        const https = require('https');
        const payload = JSON.stringify({
          peer_id: peerId,
          text: '✅ Бот работает! Токен правильный.'
        });
        
        const req = https.request({
          hostname: 'api.max.ru',
          path: '/messages.send',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BOT_TOKEN}`,
            'Content-Length': payload.length
          }
        }, (res) => {
          console.log('✅ Ответ отправлен, статус:', res.statusCode);
        });
        
        req.on('error', (e) => console.error('Ошибка отправки:', e.message));
        req.write(payload);
        req.end();
        
        console.log('📩 Получена команда /start от', peerId);
      }
      
      res.writeHead(200);
      res.end('ok');
    } catch (e) {
      console.error('❌ Ошибка обработки:', e.message);
      res.writeHead(200);
      res.end('ok');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🤖 Бот запущен на порту ${PORT}. Жду /start...`);
});

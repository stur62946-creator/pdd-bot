const https = require('https');

const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';

function sendMessage(peerId, text) {
  const data = JSON.stringify({ peer_id: peerId, text: text });
  const options = {
    hostname: 'api.max.ru',
    path: '/messages.send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BOT_TOKEN}`,
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`✅ Ответ отправлен (статус: ${res.statusCode})`);
  });

  req.on('error', (e) => {
    console.error(`❌ Ошибка отправки: ${e.message}`);
  });

  req.write(data);
  req.end();
}

const http = require('http');

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const event = JSON.parse(body);
      if (event.type === 'message_new') {
        const text = event.message?.text?.toLowerCase();
        const peerId = event.message?.peer_id;

        if (text === '/start') {
          sendMessage(peerId, '✅ Бот работает! Привет.');
          console.log('✅ Получен /start');
        }
      }
      res.writeHead(200);
      res.end('ok');
    } catch (e) {
      console.error('Ошибка:', e.message);
      res.writeHead(200);
      res.end('ok');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🤖 Бот запущен на порту ${PORT}. Жду /start...`);
});

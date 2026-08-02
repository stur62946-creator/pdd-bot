const https = require('https');
const http = require('http');

const BOT_TOKEN = 'f9LHodD0cOKXMHP37xldc4aOnIDrcWurLnRAdVE8lw6xo_7If_pFn9UDZ4LUxEouW9xZORdBt-jMoJFdlPvJ';

// Максимально простой клиент для API
function maxRequest(path, body, callback) {
  const data = JSON.stringify(body);
  const options = {
    hostname: 'api.max.ru',
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BOT_TOKEN}`,
      'Content-Length': data.length
    }
  };
  const req = https.request(options, (res) => {
    let chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => {
      callback(null, res.statusCode, Buffer.concat(chunks).toString());
    });
  });
  req.on('error', (e) => callback(e));
  req.write(data);
  req.end();
}

// Сервер для Callback API
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => body += chunk);
  req.on('end', () => {
    try {
      const event = JSON.parse(body);
      if (event.type === 'message_new') {
        const text = event.message?.text?.toLowerCase();
        const peerId = event.message?.peer_id;
        if (text === '/start') {
          maxRequest('/messages.send', {
            peer_id: peerId,
            text: '✅ Бот работает!'
          }, (err, code) => {
            console.log('✅ Ответ отправлен');
          });
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
  console.log(`🤖 Бот запущен (автономный). Жду /start...`);
});

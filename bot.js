const axios = require('axios');
const http = require('http');

const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';

async function sendMessage(peerId, text) {
  await axios.post('https://api.max.ru/messages.send', {
    peer_id: peerId,
    text: text
  }, {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` }
  });
}

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const event = JSON.parse(body);

      if (event.type === 'message_new') {
        const text = event.message?.text?.toLowerCase();
        const peerId = event.message?.peer_id;

        if (text === '/start') {
          await sendMessage(peerId, '✅ Бот работает! Команда получена.');
          console.log('✅ Ответил на /start');
        }
      }

      res.writeHead(200);
      res.end('ok');
    } catch (e) {
      console.error(e);
      res.writeHead(200);
      res.end('ok');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🤖 Бот запущен на порту ${PORT}. Жду /start...`);
});

const http = require('http');
const axios = require('axios');

const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';

const server = http.createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  
  try {
    const event = JSON.parse(body);
    console.log('📩 Событие получено:', event.type);

    if (event.type === 'message_new' && event.message?.text?.toLowerCase() === '/start') {
      const peerId = event.message.peer_id;
      await axios.post('https://api.max.ru/messages.send', {
        peer_id: peerId,
        text: '✅ Бот работает! Привет!'
      }, {
        headers: { Authorization: `Bearer ${BOT_TOKEN}` }
      });
      console.log('✅ Ответ отправлен на /start');
    }

    res.writeHead(200);
    res.end('ok');
  } catch (e) {
    console.error('❌ Ошибка:', e.message);
    res.writeHead(200);
    res.end('ok');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🤖 Бот готов на порту ${PORT} и ждёт /start...`));

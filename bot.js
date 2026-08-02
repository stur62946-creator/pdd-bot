const axios = require('axios');
const http = require('http');

// Переменные (используем process.env, если они есть)
const BOT_TOKEN = process.env.MAX_BOT_TOKEN || process.env.MAX_TOKEN || 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';
const CHANNEL_ID = '77483436379527';
const API_URL = 'https://api.max.ru/messages.send';

// Тестовый вопрос
const questions = [
  { id: 1, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Road_sign_3.27.svg/1200px-Road_sign_3.27.svg.png',
    text: 'Что означает знак 3.27?',
    options: ['Остановка запрещена', 'Стоянка запрещена', 'Движение запрещено', 'Пешеходный переход'],
    correct: 0 }
];

async function sendMessage(peerId, text, keyboard = null, attachment = null) {
  const payload = { peer_id: peerId, text };
  if (keyboard) payload.keyboard = keyboard;
  if (attachment) payload.attachment = attachment;
  await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` }
  });
}

// HTTP-сервер: слушает запросы от Max
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const event = JSON.parse(body);

      // Команда /start
      if (event.type === 'message_new') {
        const text = event.message?.text?.toLowerCase();
        const peerId = event.message?.peer_id;
        if (text === '/start') {
          const q = questions[0];
          const keyboard = {
            inline: true,
            buttons: q.options.map((opt, i) => [
              { type: 'text', label: opt, payload: JSON.stringify({ answer: i }) }
            ])
          };
          await sendMessage(CHANNEL_ID, q.text, keyboard, q.image);
          await sendMessage(peerId, '✅ Пост отправлен в канал!');
        }
      }

      // Нажатие кнопки
      if (event.type === 'message_payload') {
        const payload = JSON.parse(event.message?.payload || '{}');
        const q = questions[0];
        const isCorrect = payload.answer === q.correct;
        const resp = isCorrect ? '✅ Верно!' : `❌ Неверно. Правильный ответ: ${q.options[q.correct]}`;
        await sendMessage(event.message?.peer_id, resp);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.error('Ошибка:', err.message);
      res.writeHead(200);
      res.end('ok');
    }
  });
});

// Запускаем на порту 3000 (как ждёт bothost.ru)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🤖 Бот запущен на порту ${PORT}. Жду команду /start...`);
});

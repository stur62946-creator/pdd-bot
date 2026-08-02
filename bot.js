const axios = require('axios');
const http = require('http');

// ============================================================
// Твои данные
// ============================================================
const BOT_TOKEN = 'f9LHodD0cOKD36Dt6aXPSyuvzh1cr95O6kcyGcB0AMiHHxtKZj2Fy_q6xF8uUvCayTgFzpiS0piKKGxdmFGf';
const CHANNEL_ID = '77483436379527';
const API_URL = 'https://api.max.ru/messages.send';

// Вопрос для теста
const questions = [
  {
    id: 1,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Road_sign_3.27.svg/1200px-Road_sign_3.27.svg.png',
    text: 'Что означает знак 3.27?',
    options: ['Остановка запрещена', 'Стоянка запрещена', 'Движение запрещено', 'Пешеходный переход'],
    correct: 0
  }
];

// Функция для отправки сообщения
async function sendMessage(peerId, text, keyboard = null, attachment = null) {
  const payload = { peer_id: peerId, text: text };
  if (keyboard) payload.keyboard = keyboard;
  if (attachment) payload.attachment = attachment;

  await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` }
  });
}

// Функция для создания кнопок
function createKeyboard(options) {
  return {
    inline: true,
    buttons: options.map((opt, index) => [
      {
        type: 'text',
        label: opt,
        payload: JSON.stringify({ answer: index })
      }
    ])
  };
}

// === HTTP-сервер для Callback API ===
const server = http.createServer(async (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const event = JSON.parse(body);

      // Если это новое сообщение
      if (event.type === 'message_new') {
        const text = event.message?.text?.toLowerCase();
        const peerId = event.message?.peer_id;

        if (text === '/start') {
          const q = questions[0];
          const keyboard = createKeyboard(q.options);

          await sendMessage(CHANNEL_ID, q.text, keyboard, q.image);
          await sendMessage(peerId, '✅ Пост с опросом отправлен в канал!');
        }
      }

      // Если это нажатие на кнопку
      if (event.type === 'message_payload') {
        const payload = JSON.parse(event.message?.payload || '{}');
        const peerId = event.message?.peer_id;
        const q = questions[0];
        
        const isCorrect = payload.answer === q.correct;
        const responseText = isCorrect 
          ? '✅ Верно! Молодец!' 
          : `❌ Неверно. Правильный ответ: ${q.options[q.correct]}`;

        await sendMessage(peerId, responseText);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.error('❌ Ошибка обработки запроса:', err);
      res.writeHead(200);
      res.end('ok');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🤖 Бот запущен на порту ${PORT}. Жду команду /start...`);
});
